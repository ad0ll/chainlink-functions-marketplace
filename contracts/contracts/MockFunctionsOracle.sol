pragma solidity ^0.8.18;

import {FunctionsOracleInterface} from "./functions/interfaces/FunctionsOracleInterface.sol";
import {FunctionsBillingRegistryInterface} from "./functions/interfaces/FunctionsBillingRegistryInterface.sol";

contract MockFunctionsOracle is FunctionsOracleInterface {
    uint256 public constant BASE_FEE = 10 ** 18 / 10; // 0.1 LINK
    uint256 nonce = 0;
    FunctionsBillingRegistryInterface public registry;

    error EmptyRequestData();
    error InconsistentReportData();
    error EmptyPublicKey();
    error EmptyBillingRegistry();
    error UnauthorizedPublicKeyChange();

    function getRegistry() external view returns (address) {
        return address(registry);
    }

    function setRegistry(address _registry) external {
        registry = FunctionsBillingRegistryInterface(_registry);
    }

    function getDONPublicKey() external view returns (bytes memory) {
        return new bytes(0);
    }

    function setDONPublicKey(bytes memory) external {}

    function setDONAddress(address) external {}

    function setNodePublicKey(address node, bytes calldata publicKey) external {}

    function deleteNodePublicKey(address node) external {}

    function getAllNodePublicKeys() external view returns (address[] memory, bytes[] memory) {
        return (new address[](0), new bytes[](0));
    }

    /**
     * @notice Determine the fee charged by the DON that will be split between signing Node Operators for servicing the request
     * @param data Encoded Chainlink Functions request data, use FunctionsClient API to encode a request
     * @param billing The request's billing configuration
     * @return fee Cost in Juels (1e18) of LINK
     */
    function getRequiredFee(bytes calldata data, FunctionsBillingRegistryInterface.RequestBilling calldata billing)
        external
        view
        returns (uint96)
    {
        return uint96(BASE_FEE);
    }

    /**
     * @notice Estimate the total cost that will be charged to a subscription to make a request: gas re-imbursement, plus DON fee, plus Registry fee
     * @param subscriptionId A unique subscription ID allocated by billing system,
     * a client can make requests from different contracts referencing the same subscription
     * @param data Encoded Chainlink Functions request data, use FunctionsClient API to encode a request
     * @param gasLimit Gas limit for the fulfillment callback
     * @return billedCost Cost in Juels (1e18) of LINK
     */
    function estimateCost(uint64 subscriptionId, bytes calldata data, uint32 gasLimit, uint256 gasPrice)
        external
        view
        returns (uint96)
    {
        return uint96(BASE_FEE);
    }

    /**
     * @notice Sends a request (encoded as data) using the provided subscriptionId
     * @param subscriptionId A unique subscription ID allocated by billing system,
     * a client can make requests from different contracts referencing the same subscription
     * @param data Encoded Chainlink Functions request data, use FunctionsClient API to encode a request
     * @param gasLimit Gas limit for the fulfillment callback
     * @return requestId A unique request identifier (unique per DON)
     */
    // function sendRequest(uint64 subscriptionId, bytes calldata data, uint32 gasLimit) external returns (bytes32) {
    //     return keccak256(abi.encode(subscriptionId, block.timestamp, nonce++));
    // }

    function sendRequest(uint64 subscriptionId, bytes calldata data, uint32 gasLimit)
        external
        override
        registryIsSet
        returns (bytes32)
    {
        if (data.length == 0) {
            revert EmptyRequestData();
        }
        bytes32 requestId = registry.startBilling(
            data, FunctionsBillingRegistryInterface.RequestBilling(subscriptionId, msg.sender, gasLimit, tx.gasprice)
        );
        // emit OracleRequest(
        //     requestId, msg.sender, tx.origin, subscriptionId, registry.getSubscriptionOwner(subscriptionId), data
        // );
        return requestId;
    }

    /**
     * @dev Reverts if the the billing registry is not set
     */
    modifier registryIsSet() {
        if (address(registry) == address(0)) {
            revert EmptyBillingRegistry();
        }
        _;
    }
}
