pragma solidity ^0.8.18;

import {FunctionsOracleInterface} from "./functions/interfaces/FunctionsOracleInterface.sol";
import {FunctionsBillingRegistryInterface} from "./functions/interfaces/FunctionsBillingRegistryInterface.sol";
import {FunctionsManager} from "./FunctionsManager.sol";
import {FunctionsClientInterface} from "./functions/interfaces/FunctionsClientInterface.sol";
import "hardhat/console.sol";

contract MockBillingRegistry {
    uint16 public constant MAX_CONSUMERS = 100;

    error TooManyConsumers();
    error InsufficientBalance();
    error InvalidConsumer(uint64 subscriptionId, address consumer);
    error InvalidSubscription();
    error OnlyCallableFromLink();
    error InvalidCalldata();
    error MustBeSubOwner(address owner);
    error PendingRequestExists();
    error MustBeRequestedOwner(address proposedOwner);
    error BalanceInvariantViolated(uint256 internalBalance, uint256 externalBalance); // Should never

    uint96 public constant BASE_FEE = 10 ** 18 * 0.2; // 0.2 LINK

    event FulfillAndBillLog(
        bytes32 indexed requestId, uint64 indexed subscriptionId, bytes res, bytes err, bool success
    );

    struct Subscription {
        // There are only 1e9*1e18 = 1e27 juels in existence, so the balance can fit in uint96 (2^96 ~ 7e28)
        uint96 balance; // Common LINK balance that is controlled by the Registry to be used for all consumer requests.
        uint96 blockedBalance; // LINK balance that is reserved to pay for pending consumer requests.
    }
    // We use the config for the mgmt APIs

    struct SubscriptionConfig {
        address owner; // Owner can fund/withdraw/cancel the sub.
        address requestedOwner; // For safely transferring sub ownership.
        // Maintains the list of keys in s_consumers.
        // We do this for 2 reasons:
        // 1. To be able to clean up all keys from s_consumers when canceling a subscription.
        // 2. To be able to return the list of all consumers in getSubscription.
        // Note that we need the s_consumers map to be able to directly check if a
        // consumer is valid without reading all the consumers from storage.
        address[] consumers;
    }
    // Note a nonce of 0 indicates an the consumer is not assigned to that subscription.

    mapping(address => mapping(uint64 => uint64)) /* consumer */ /* subscriptionId */ /* nonce */ private s_consumers;
    mapping(uint64 => SubscriptionConfig) /* subscriptionId */ /* subscriptionConfig */ private s_subscriptionConfigs;
    mapping(uint64 => Subscription) /* subscriptionId */ /* subscription */ private s_subscriptions;
    // We make the sub count public so that its possible to
    // get all the current subscriptions via getSubscription.
    uint64 private s_currentsubscriptionId;
    // s_totalBalance tracks the total link sent to/from
    // this contract through onTokenTransfer, cancelSubscription and oracleWithdraw.
    // A discrepancy with this contract's link balance indicates someone
    // sent tokens using transfer and so we may need to use recoverFunds.
    uint96 private s_totalBalance;

    event SubscriptionCreated(uint64 indexed subscriptionId, address owner);
    event SubscriptionFunded(uint64 indexed subscriptionId, uint256 oldBalance, uint256 newBalance);
    event SubscriptionConsumerAdded(uint64 indexed subscriptionId, address consumer);
    event SubscriptionConsumerRemoved(uint64 indexed subscriptionId, address consumer);
    event SubscriptionCanceled(uint64 indexed subscriptionId, address to, uint256 amount);
    event SubscriptionOwnerTransferRequested(uint64 indexed subscriptionId, address from, address to);
    event SubscriptionOwnerTransferred(uint64 indexed subscriptionId, address from, address to);

    modifier onlySubOwner(uint64 subscriptionId) {
        address owner = s_subscriptionConfigs[subscriptionId].owner;
        console.log("owner of subscription %d: %s, msg.sender: %s", subscriptionId, owner, msg.sender);
        if (owner == address(0)) {
            revert InvalidSubscription();
        }
        if (msg.sender != owner) {
            console.log("msg.sender %s is not owner %s", msg.sender, owner);
            revert MustBeSubOwner(owner);
        }
        _;
    }

    FunctionsManager functionsManager;

    function setFunctionsManager(address _functionsManager) external {
        functionsManager = FunctionsManager(_functionsManager);
    }

    function getSubscription(uint64 subscriptionId)
        external
        view
        returns (uint96 balance, address owner, address[] memory consumers)
    {
        if (s_subscriptionConfigs[subscriptionId].owner == address(0)) {
            revert InvalidSubscription();
        }
        return (
            s_subscriptions[subscriptionId].balance,
            s_subscriptionConfigs[subscriptionId].owner,
            s_subscriptionConfigs[subscriptionId].consumers
        );
    }

    function createSubscription() external returns (uint64) {
        s_currentsubscriptionId++;
        uint64 currentsubscriptionId = s_currentsubscriptionId;
        address[] memory consumers = new address[](0);
        s_subscriptions[currentsubscriptionId] = Subscription({balance: 0, blockedBalance: 0});
        s_subscriptionConfigs[currentsubscriptionId] =
            SubscriptionConfig({owner: msg.sender, requestedOwner: address(0), consumers: consumers});

        emit SubscriptionCreated(currentsubscriptionId, msg.sender);
        return currentsubscriptionId;
    }

    /**
     * @notice Add a consumer to a Chainlink Functions subscription.
     * @param subscriptionId - ID of the subscription
     * @param consumer - New consumer which can use the subscription
     */
    function addConsumer(uint64 subscriptionId, address consumer) external onlySubOwner(subscriptionId) {
        // Already maxed, cannot add any more consumers.
        if (s_subscriptionConfigs[subscriptionId].consumers.length == MAX_CONSUMERS) {
            revert TooManyConsumers();
        }
        if (s_consumers[consumer][subscriptionId] != 0) {
            // Idempotence - do nothing if already added.
            // Ensures uniqueness in s_subscriptions[subscriptionId].consumers.
            return;
        }
        // Initialize the nonce to 1, indicating the consumer is allocated.
        s_consumers[consumer][subscriptionId] = 1;
        s_subscriptionConfigs[subscriptionId].consumers.push(consumer);

        emit SubscriptionConsumerAdded(subscriptionId, consumer);
    }

    function forceBalance(uint64 subscriptionId, uint96 balance) external /*onlySubOwner(subscriptionId)*/ {
        s_subscriptions[subscriptionId].balance = balance;
    }

    function startBilling(bytes calldata data, FunctionsBillingRegistryInterface.RequestBilling calldata billing)
        external
        returns (bytes32)
    {
        // Input validation using the subscription storage.
        if (s_subscriptionConfigs[billing.subscriptionId].owner == address(0)) {
            revert InvalidSubscription();
        }
        // It's important to ensure that the consumer is in fact who they say they
        // are, otherwise they could use someone else's subscription balance.
        // A nonce of 0 indicates consumer is not allocated to the sub.
        uint64 currentNonce = s_consumers[billing.client][billing.subscriptionId];
        if (currentNonce == 0) {
            revert InvalidConsumer(billing.subscriptionId, billing.client);
        }
        // No lower bound on the requested gas limit. A user could request 0
        // and they would simply be billed for the gas and computation.
        // if (billing.gasLimit > s_config.maxGasLimit) {
        //     revert GasLimitTooBig(billing.gasLimit, s_config.maxGasLimit);
        // }
        // if (billing.gasLimit > s_config.maxGasLimit) {
        //     revert GasLimitTooBig(billing.gasLimit, s_config.maxGasLimit);
        // }

        // Let the world burn
        // uint96 oracleFee = FunctionsOracleInterface(msg.sender).getRequiredFee(data, billing);
        // uint96 registryFee = getRequiredFee(data, billing);
        // uint96 estimatedCost = estimateCost(billing.gasLimit, billing.gasPrice, oracleFee, registryFee);
        // uint96 effectiveBalance =
        //     s_subscriptions[billing.subscriptionId].balance - s_subscriptions[billing.subscriptionId].blockedBalance;
        // if (effectiveBalance < estimatedCost) {
        //     revert InsufficientBalance();
        // }

        uint64 nonce = currentNonce + 1;

        return keccak256(abi.encode(billing.subscriptionId, block.timestamp, nonce++));
        // bytes32 requestId = computeRequestId(msg.sender, billing.client, billing.subscriptionId, nonce);

        // Commitment memory commitment = Commitment(
        //     billing.subscriptionId,
        //     billing.client,
        //     billing.gasLimit,
        //     billing.gasPrice,
        //     msg.sender,
        //     oracleFee,
        //     registryFee,
        //     estimatedCost,
        //     block.timestamp
        // );
        // s_requestCommitments[requestId] = commitment;
        // s_subscriptions[billing.subscriptionId].blockedBalance += estimatedCost;

        // emit BillingStart(requestId, commitment);
        // s_consumers[billing.client][billing.subscriptionId] = nonce;
        // return requestId;
    }
    /*
    * @dev calls target address with exactly gasAmount gas and data as calldata
    * or reverts if at least gasAmount gas is not available.
    */

    function callWithExactGas(uint256 gasAmount, address target, bytes memory data) private returns (bool success) {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            let g := gas()
            // GAS_FOR_CALL_EXACT_CHECK = 5000
            // Compute g -= GAS_FOR_CALL_EXACT_CHECK and check for underflow
            // The gas actually passed to the callee is min(gasAmount, 63//64*gas available).
            // We want to ensure that we revert if gasAmount >  63//64*gas available
            // as we do not want to provide them with less, however that check itself costs
            // gas.  GAS_FOR_CALL_EXACT_CHECK ensures we have at least enough gas to be able
            // to revert if gasAmount >  63//64*gas available.
            if lt(g, 5000) { revert(0, 0) }
            g := sub(g, 5000)
            // if g - g//64 <= gasAmount, revert
            // (we subtract g//64 because of EIP-150)
            if iszero(gt(sub(g, div(g, 64)), gasAmount)) { revert(0, 0) }
            // solidity calls check that a contract actually exists at the destination, so we do the same
            if iszero(extcodesize(target)) { revert(0, 0) }
            // call and return whether we succeeded. ignore return data
            // call(gas,addr,value,argsOffset,argsLength,retOffset,retLength)
            success := call(gasAmount, target, 0, add(data, 0x20), mload(data), 0, 0)
        }

        return success;
    }

    function fulfillAndBill(bytes32 requestId, bytes calldata response, bytes calldata err) external returns (bool) {
        console.log("In fulfillAndBill");
        bytes memory callback =
            abi.encodeWithSelector(FunctionsClientInterface.handleOracleFulfillment.selector, requestId, response, err);

        // TODO set gas amount
        FunctionsManager.FunctionResponse memory req = functionsManager.getFunctionResponse(requestId);
        FunctionsManager.FunctionMetadata memory meta = functionsManager.getFunction(req.functionId);
        // bool success = callWithExactGas(meta.subId, address(functionsManager), callback);
        bool success = callWithExactGas(3_000_000, address(functionsManager), callback);
        if (s_subscriptions[meta.subId].balance < BASE_FEE) {
            revert InsufficientBalance();
        }
        s_subscriptions[meta.subId].balance -= BASE_FEE;
        emit FulfillAndBillLog(requestId, meta.subId, response, err, success);
        console.log("Finished calling fulfillAndBill");
        return success;
    }

    function computeRequestId(address don, address client, uint64 subscriptionId, uint64 nonce)
        private
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(don, client, subscriptionId, nonce));
    }
}
