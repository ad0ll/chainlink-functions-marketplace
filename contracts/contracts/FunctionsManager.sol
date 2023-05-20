// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {FunctionsClient} from "./functions/FunctionsClient.sol";
import {Functions} from "./functions/Functions.sol";
import {FunctionsBillingRegistry} from "./functions/FunctionsBillingRegistry.sol";
import {FunctionsOracleInterface} from "./functions/interfaces/FunctionsOracleInterface.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "hardhat/console.sol";

contract FunctionsManager is FunctionsClient, ConfirmedOwner {
    using Functions for Functions.Request;

    mapping(bytes32 => FunctionMetadata) public functionMetadatas;
    mapping(bytes32 => FunctionResponse) public functionResponses;
    mapping(uint64 => address) private subscriptionOwnerMapping;
    mapping(bytes32 => bool) private existingNameOwnerPair;
    mapping(address => AuthorMetadata) public authorMetadata;
    mapping(uint64 => string) public categoryNames;
    mapping(uint64 => uint96) public subscriptionBalances;
    // mapping(bytes32 => FeePool) public feePools;
    LinkTokenInterface private LINK;
    FunctionsBillingRegistry private BILLING_REGISTRY;
    FunctionsOracleInterface private ORACLE_PROXY;

    // TODO make sure this isn't hardcoded later
    uint96 public minimumSubscriptionBalance = 10 ** 18 * 1; // 1 LINK (18 decimals)
    uint96 public functionManagerProfitPool; // The fee manager's cut of fees, whole number representing percentage
    uint96 public baseFee = 10 ** 18 * 0.2; // 0.2 LINK (18 decimals)
    uint96 public minimumSubscriptionDeposit = 10 ** 18 * 3; // 3 LINK (18 decimals)
    uint32 public feeManagerCut;

    // TODO Support authorMetadata

    // (Not in this contract) Set keeper threshold at 1 LINK
    struct FunctionsRegisterRequest {
        uint96 fees;
        string functionName;
        string desc;
        string imageUrl;
        string[] expectedArgs;
        Functions.Location codeLocation;
        Functions.Location secretsLocation;
        Functions.CodeLanguage language;
        bytes32 category;
        uint64 subId;
        string source; // Source code for Location.Inline or url for Location.Remote
        bytes secrets; // Encrypted secrets blob for Location.Inline or url for Location.Remote
    }

    struct AuthorMetadata {
        string name;
        string imageUrl;
        string websiteUrl;
    }

    // Functions metadata
    struct FunctionMetadata {
        address owner;
        uint64 subId;
        string name;
        string desc;
        string imageUrl;
        string[] expectedArgs;
        Functions.Request request;
        bytes32 category;
        uint96 fee;
        uint96 unlockedProfitPool; // There are only 1e9*1e18 = 1e27 juels in existence, uint96=(2^96 ~ 7e28)
        uint96 lockedProfitPool; // See ^
    }

    // struct FeePool{
    //     uint96 subscriptionPool;    // There are only 1e9*1e18 = 1e27 juels in existence, uint96=(2^96 ~ 7e28)
    //     uint80 unlockedProfitPool; // This is (2^80-1)/10^18, or about 1.2mil link. More than enough.
    //     uint80 lockedProfitPool; // See ^. Using uint80 to fit everything in the block.
    // }

    struct FunctionResponse {
        bytes32 functionId;
        address caller;
        bytes32 callbackFunction;
        uint256 gasDeposit;
        bytes response;
        bytes err;
    }

    // Event emitted when a Function is registered
    // Recording owner twice isn't ideal, but we want to be able to filter on owner
    event FunctionRegistered(
        bytes32 indexed functionId, address indexed owner, bytes32 indexed category, FunctionMetadata metadata
    );

    event FunctionCalled(
        bytes32 indexed functionId,
        bytes32 indexed requestId,
        address indexed caller,
        address owner,
        bytes32 callbackFunction,
        uint256 gasDeposit,
        uint96 baseFee,
        uint96 fee
    );

    event FunctionCallCompleted(
        bytes32 indexed functionId,
        bytes32 indexed requestId,
        address indexed caller,
        address owner,
        bytes32 callbackFunction,
        uint256 usedGas,
        bytes response,
        bytes err
    );

    event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

    event BaseFeeUpdated(uint256 newBaseFee);
    event FeeManagerCutUpdated(uint256 newFeeManagerCut);
    event MinimumSubscriptionDepositUpdated(uint256 newMinimumDeposit);

    // Good default values for baseFee is 10 ** 18 * 0.2 (0.2 LINK), and for feeManagerCut (5)

    constructor(
        address link,
        address billingRegistryProxy,
        address oracleProxy,
        uint96 _baseFee,
        uint32 _feeManagerCut,
        uint96 _minimumSubscriptionDeposit
    ) FunctionsClient(oracleProxy) ConfirmedOwner(msg.sender) {
        require(_feeManagerCut <= 100, "Fee manager cut must be less than or equal to 100");
        LINK = LinkTokenInterface(link);
        BILLING_REGISTRY = FunctionsBillingRegistry(billingRegistryProxy);
        ORACLE_PROXY = FunctionsOracleInterface(oracleProxy);
        baseFee = _baseFee;
        feeManagerCut = _feeManagerCut;
        minimumSubscriptionDeposit = _minimumSubscriptionDeposit;
    }

    // FunctionRegistered event - Will have metadata from register function params
    // FunctionCalled event (Probably not used by the webapp)
    // FunctionError event
    // FunctionSuccess event
    function registerFunction(FunctionsRegisterRequest calldata request) public payable returns (bytes32) {
        // Require fee is greater than 0
        require(request.fees >= 0, "Fee must be greater than or equal to 0");
        // Require function name cannot be empty
        require(bytes(request.functionName).length > 0, "Function name cannot be empty");
        require(request.category.length > 0, "Category cannot be empty");
        bytes32 dupeCheckBytes = keccak256(abi.encode(request.functionName, msg.sender));
        require(!existingNameOwnerPair[dupeCheckBytes], "Function name already exists for this owner");
        existingNameOwnerPair[dupeCheckBytes] = true;

        //Require function doesn't already exist
        FunctionMetadata memory metadata;

        metadata.owner = msg.sender;
        metadata.fee = request.fees;
        metadata.name = request.functionName;
        metadata.desc = request.desc;
        metadata.imageUrl = request.imageUrl;
        metadata.expectedArgs = request.expectedArgs;
        metadata.category = request.category;

        // Create subscription for every Function registered
        if (request.subId == 0) {
            console.log("creating new subscription");
            require(
                LINK.balanceOf(msg.sender) >= minimumSubscriptionDeposit,
                "Insufficient LINK balance to fund subscription"
            );
            metadata.subId = createSubscription();
        } else {
            console.log("using existing subscription %d, checking if authorized", request.subId);
            (, address owner, address[] memory consumers) = BILLING_REGISTRY.getSubscription(request.subId);
            bool functionsManagerIsAuthorized = owner == address(this);
            bool callerIsAuthorized = owner == msg.sender;
            //iterate over consumers to see if any of them are address(this)
            for (uint256 i = 0; i < consumers.length; i++) {
                if (consumers[i] == address(this)) {
                    functionsManagerIsAuthorized = true;
                } else if (consumers[i] == msg.sender) {
                    callerIsAuthorized = true;
                }
                if (functionsManagerIsAuthorized && callerIsAuthorized) {
                    break;
                }
            }
            require(
                functionsManagerIsAuthorized && callerIsAuthorized,
                "FunctionsManager and/or caller are not authorized consumers of the subscription"
            );
            metadata.subId = request.subId;
        }

        // Initialize Functions request into expected format
        Functions.Request memory functionsRequest;
        functionsRequest.initializeRequest(request.codeLocation, request.language, request.source);
        if (request.secretsLocation == Functions.Location.Remote && request.secrets.length > 0) {
            functionsRequest.addRemoteSecrets(request.secrets);
        }

        metadata.request = functionsRequest;

        // ??? Ensure interface is correct, probably not important ???
        // 5. Add function to FunctionsManager
        // Generate unique functions ID to be able to retrieve requests
        bytes32 functionId = keccak256(abi.encode(metadata));
        require(functionMetadatas[functionId].owner == address(0), "Function already exists");

        functionMetadatas[functionId] = metadata;

        // Emit FunctionRegistered event
        emit FunctionRegistered(functionId, msg.sender, metadata.category, metadata);

        return functionId;
    }

    function createSubscription() internal returns (uint64) {
        // Automatically sets msg sender (FunctionsManager) as subscription owner
        uint64 subId = BILLING_REGISTRY.createSubscription();

        console.log("created subscription with id %d", subId);
        console.log("adding %s as consumer", address(this));
        // Add FunctionsManager as a consumer of the subscription
        BILLING_REGISTRY.addConsumer(subId, address(this));

        // Maintaining subscription ownership internally to allow ownership transfer later
        subscriptionOwnerMapping[subId] = msg.sender;

        console.log("sender %s LINK balance %d", msg.sender, LINK.balanceOf(msg.sender));
        // Doing the below transfer requires running ERC20's approve function first. See tests for example.
        require(
            LINK.transferFrom(msg.sender, address(this), minimumSubscriptionDeposit),
            "Failed to transfer LINK to the Function Manager to fund the subscription"
        );

        // Fund subscription with LINK transferAndCall
        require(LINK.transferAndCall(address(BILLING_REGISTRY), minimumSubscriptionDeposit, abi.encode(subId)), 
            "Failed to transfer LINK to Billing Registry to fund the subscription"
        );

        return subId;
    }

    /**
     * @notice Send a simple request
     *
     * @param functionId Uniquely generated ID from registerFunctions to identify functions
     * @param args List of arguments expected by the Function request
     * @param gasLimit Maximum amount of gas used to call the client contract's `handleOracleFulfillment` function
     * @return Functions request ID
     */
    function executeRequest(bytes32 functionId, string[] calldata args, uint32 gasLimit) public returns (bytes32) {
        console.log("executeRequest called with functionId:");
        console.logBytes32(functionId);
        FunctionMetadata storage chainlinkFunction = functionMetadatas[functionId];
        require(bytes(chainlinkFunction.name).length != 0, "function is not registered");

        Functions.Request memory functionsRequest = chainlinkFunction.request;
        if (args.length > 0) functionsRequest.addArgs(args);

        console.log("collecting and locking fees");
        collectAndLockFees(functionId);
        console.log("sending functions request");
        bytes32 assignedReqID = sendRequest(functionsRequest, chainlinkFunction.subId, gasLimit);

        require(functionResponses[assignedReqID].functionId == bytes32(0), "Request ID already exists");
        functionResponses[assignedReqID].functionId = functionId;
        functionResponses[assignedReqID].caller = msg.sender;

        console.log("emitting FunctionCalled event");
        emit FunctionCalled({
            functionId: functionId,
            caller: msg.sender,
            requestId: assignedReqID,
            owner: functionMetadatas[functionId].owner,
            callbackFunction: bytes32(""),
            baseFee: baseFee,
            fee: functionMetadatas[functionId].fee,
            gasDeposit: 0
        });
        return assignedReqID;
    }

    /**
     * @notice Callback that is invoked once the DON has resolved the request or hit an error
     *
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        // Allow only the Billing Registry to call fulfillRequest
        require(address(BILLING_REGISTRY) == msg.sender, "Only the function owner or Billing Registry can call this function");
        console.log("fulfilling request");
        FunctionResponse storage functionResponse = functionResponses[requestId];
        // Require response is registered
        require(functionResponse.caller != address(0), "Invalid request ID");
        console.log("Checking is %s is authorized to call this function...", msg.sender);
        require(
            functionMetadatas[functionResponse.functionId].owner == msg.sender
                || address(BILLING_REGISTRY) == msg.sender || address(ORACLE_PROXY) == msg.sender,
            "Only the function owner can call this function"
        );
        console.log("%s is authorized...", msg.sender);
        functionResponse.response = response;
        functionResponse.err = err;
        console.log("Unlocking fees");

        unlockFees(functionResponse.functionId);
        uint64 subId = functionMetadatas[functionResponse.functionId].subId;
        address funcOwner = functionMetadatas[functionResponse.functionId].owner;
        console.log("Finished unlocking fees, checking if need fill subscription");
        //Refill the subscription if necessary, do this in fulfillRequest so the function caller pays for it
        (uint96 balance,,) = BILLING_REGISTRY.getSubscription(subId);
        if (balance < minimumSubscriptionBalance) {
            refillSubscription(subId);
        }

        // Emit FunctionCallCompleted event
        emit FunctionCallCompleted({
            functionId: functionResponse.functionId,
            caller: functionResponse.caller,
            requestId: requestId,
            owner: funcOwner,
            callbackFunction: functionResponse.callbackFunction,
            response: response,
            err: err,
            usedGas: 0
        });
    }

    function collectAndLockFees(bytes32 functionId) private {
        uint96 premiumFee = functionMetadatas[functionId].fee;
        uint96 totalFee = baseFee + premiumFee;
        uint64 subId = functionMetadatas[functionId].subId;
        uint96 functionManagerCut = (premiumFee * feeManagerCut) / 100;

        console.log("sender %s LINK balance %d", msg.sender, LINK.balanceOf(msg.sender));
        require(
            LINK.balanceOf(msg.sender) >= totalFee,
            "You do not have enough LINK to call this function"
        );
        console.log("Transferring %d LINK", totalFee);
        // Doing the below transfer requires running ERC20's approve function first. See tests for example.
        require(
            LINK.transferFrom(msg.sender, address(this), totalFee),
            "Failed to collect fees from caller"
        );
        console.log("reserved subscription fee %d", subscriptionBalances[subId]);
        subscriptionBalances[subId] = subscriptionBalances[subId] + baseFee;

        console.log(
            "added baseFee %d LINK to subscription pool, total in pool: %d", baseFee, subscriptionBalances[subId]
        );

        functionManagerProfitPool = functionManagerProfitPool + functionManagerCut;
        functionMetadatas[functionId].lockedProfitPool =
            functionMetadatas[functionId].lockedProfitPool + premiumFee - functionManagerCut;
        console.log(
            "took %d from fee of %d LINK and added to feeManagerProfitPool, total in pool: %d ",
            functionManagerCut,
            premiumFee,
            functionManagerProfitPool
        );
    }

    function unlockFees(bytes32 functionId) private {
        console.log("Unlocking fees");
        require(functionMetadatas[functionId].owner != address(0), "Function does not exist");
        // Function manager has already taken its cut, so calculate the amount owed to the function owner
        // by taking the FunctionManager cut from the fee and adding it to the owner profit pool
        uint96 unlockAmount = (functionMetadatas[functionId].fee * (100 - feeManagerCut)) / 100;
        console.log(
            "Before locked %d unlocked %d",
            functionMetadatas[functionId].lockedProfitPool,
            functionMetadatas[functionId].unlockedProfitPool
        );
        functionMetadatas[functionId].lockedProfitPool -= unlockAmount;
        functionMetadatas[functionId].unlockedProfitPool += unlockAmount;
        console.log(
            "After locked %d unlocked %d",
            functionMetadatas[functionId].lockedProfitPool,
            functionMetadatas[functionId].unlockedProfitPool
        );
    }

    // TODO If we keep this function, we need to let the keeper call it
    function forceUnlockFees(bytes32 functionId) external onlyOwner {
        FunctionMetadata storage chainlinkFunction = functionMetadatas[functionId];
        require(chainlinkFunction.owner != address(0), "Function does not exist");
        unlockFees(functionId);
    }

    function approveTokenSpender(address _spender, uint256 _value) external onlyOwner {
        // TODO should approve USDC later
        console.log("approving %s as a spender of LINK with a value of up to %d", _spender, _value);
        LINK.approve(_spender, _value);
    }

    // Refills the subscription with all funds we have reserved
    function refillSubscription(uint64 _subscriptionId) public {
        //TODO need to find some way to reserve the expense for this transfer out of owner fees
        // require(LINK.allowance(msg.sender, address(this)), "caller is not approved to spend LINK"); //Only the keeper should be authorized for this
        // TODO, are there any checks we should have here? Like, should we check that the caller is authorized?
        console.log(
            "Refilling subscription %d with all available balance %d",
            _subscriptionId,
            subscriptionBalances[_subscriptionId]
        );
        uint96 amountToTransfer = subscriptionBalances[_subscriptionId];
        subscriptionBalances[_subscriptionId] = 0;
        LINK.transferAndCall(address(BILLING_REGISTRY), amountToTransfer, abi.encode(_subscriptionId));
    }

    /*
        EVERYTHING BELOW IS MINUTAE, just getting it out of the way of the rest of the code
    */
    function setBaseFee(uint96 _baseFee) external onlyOwner {
        baseFee = _baseFee;
        emit BaseFeeUpdated(_baseFee);
    }

    function setFeeManagerCut(uint32 _feeManagerCut) external onlyOwner {
        feeManagerCut = _feeManagerCut;
        emit FeeManagerCutUpdated(_feeManagerCut);
    }

    function setMinimumDeposit(uint96 _minimumDeposit) external onlyOwner {
        minimumSubscriptionDeposit = _minimumDeposit;
        emit MinimumSubscriptionDepositUpdated(_minimumDeposit);
    }

    function getFunction(bytes32 _functionId) external view returns (FunctionMetadata memory) {
        console.log("getFunction");
        return functionMetadatas[_functionId];
    }

    function getFunctionResponse(bytes32 _requestId) external view returns (FunctionResponse memory) {
        console.log("getFunctionResponse");
        return functionResponses[_requestId];
    }

    function getSubscriptionBalance(uint64 _subscriptionId) external view returns (uint256) {
        console.log("getSubscriptionBalance");
        return subscriptionBalances[_subscriptionId];
    }

    /*
        EVERYTHING BELOW IS FOR TESTING ONLY, MUST BE REMOVED FOR PROD
    */
    //    function injectRequest(bytes32 requestId)
}
