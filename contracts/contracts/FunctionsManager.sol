// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {FunctionsClient} from "./functions/FunctionsClient.sol";
import {Functions} from "./functions/Functions.sol";
import {FunctionsBillingRegistry} from "./functions/FunctionsBillingRegistry.sol";
import {FunctionsBillingRegistryInterface} from "./functions/interfaces/FunctionsBillingRegistryInterface.sol";
import {FunctionsOracleInterface} from "./functions/interfaces/FunctionsOracleInterface.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "hardhat/console.sol";

contract FunctionsManager is FunctionsClient, ConfirmedOwner {
    using Functions for Functions.Request;

    mapping(bytes32 => FunctionMetadata) public functionMetadatas;
    mapping(bytes32 => FunctionExecuteMetadata) public functionExecuteMetadatas;
    mapping(bytes32 => FunctionResponse) public functionResponses;
    mapping(bytes32 => Functions.Request) private functionRequests;
    mapping(uint64 => address) private subscriptionOwnerMapping;
    mapping(address => AuthorMetadata) public authorMetadata;
    // Balances that can be dumped into a subscription when the subscription balance runs low
    mapping(uint64 => uint96) public subscriptionBalances;

    // mapping(bytes32 => FeePool) public feePools;
    LinkTokenInterface private LINK;
    FunctionsBillingRegistry private BILLING_REGISTRY;
    FunctionsOracleInterface private ORACLE_PROXY;

    // TODO make sure this isn't hardcoded later
    uint96 public minimumSubscriptionBalance = 10 ** 18 * 1; // 1 LINK (18 decimals)
    uint96 public functionManagerProfitPool; // The fee manager's cut of fees, whole number representing percentage
    uint32 public feeManagerCut;

    // Global metrics
    uint64 public functionsRegisteredCount;
    uint96 public functionsCalledCount;
    uint96 public totalFeesCollected;
    uint32 public maxGasLimit = 300_000; //Leave this at 300k, see service limits doc

    // TODO Support authorMetadata
    enum ReturnTypes {
        Bytes,
        Uint256,
        Int256,
        String
    }

    // (Not in this contract) Set keeper threshold at 1 LINK
    struct FunctionsRegisterRequest {
        uint96 fees;
        string functionName;
        string desc;
        string imageUrl;
        string source; // Source code for Location.Inline or url for Location.Remote
        string[] expectedArgs;
        Functions.Location codeLocation;
        Functions.Location secretsLocation;
        Functions.CodeLanguage language;
        bytes32 category;
        uint64 subId;
        ReturnTypes expectedReturnType;
        bytes secrets; // Encrypted secrets blob for Location.Inline or url for Location.Remote
    }

    // Data that's used or required by executeRequest and fulfillRequest
    struct FunctionExecuteMetadata {
        address owner;
        uint64 subId;
        uint96 fee;
        uint96 unlockedProfitPool; // There are only 1e9*1e18 = 1e27 juels in existence, uint96=(2^96 ~ 7e28)
        uint64 functionsCalledCount;
        uint96 lockedProfitPool; // See ^
        uint96 totalFeesCollected;
        uint64 successfulResponseCount;
        uint64 failedResponseCount;
    }

    struct AuthorMetadata {
        string name;
        string imageUrl;
        string websiteUrl;
    }

    // Functions metadata, used for display and snippet generation in the webapp
    struct FunctionMetadata {
        address owner;
        bytes32 category;
        ReturnTypes expectedReturnType;
        string name;
        string desc;
        string imageUrl;
        string[] expectedArgs;
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
        bytes response;
        bytes err;
    }

    // Event emitted when a Function is registered
    // Recording owner twice isn't ideal, but we want to be able to filter on owner
    event FunctionRegistered(
        bytes32 indexed functionId,
        address indexed owner,
        bytes32 indexed category,
        FunctionMetadata metadata,
        uint96 fee,
        uint64 subId
    );

    event FunctionCalled(
        bytes32 indexed functionId,
        bytes32 indexed requestId,
        address indexed caller,
        address owner,
        bytes32 callbackFunction,
        uint96 baseFee,
        uint96 fee
    );

    event FunctionCallCompleted(
        bytes32 indexed functionId,
        bytes32 indexed requestId,
        address indexed caller,
        address owner,
        bytes32 callbackFunction,
        bytes response,
        bytes err
    );

    event FeeManagerCutUpdated(uint32 newFeeManagerCut);
    event MinimumSubscriptionBalanceUpdated(uint96 newMinimumSubscriptionBalance);
    event MaxGasLimitUpdated(uint32 newMaxGasLimit);

    constructor(
        address link,
        address billingRegistryProxy,
        address oracleProxy,
        uint32 _feeManagerCut,
        uint96 _minimumSubscriptionBalance,
        uint32 _maxGasLimit
    ) FunctionsClient(oracleProxy) ConfirmedOwner(msg.sender) {
        require(_feeManagerCut <= 100, "Fee manager cut must be less than or equal to 100");
        LINK = LinkTokenInterface(link);
        BILLING_REGISTRY = FunctionsBillingRegistry(billingRegistryProxy);
        ORACLE_PROXY = FunctionsOracleInterface(oracleProxy);
        feeManagerCut = _feeManagerCut;
        minimumSubscriptionBalance = _minimumSubscriptionBalance;
        maxGasLimit = _maxGasLimit;
    }

    function registerFunction(FunctionsRegisterRequest calldata request) public payable returns (bytes32) {
        require(request.fees >= 0, "Fee must be greater than or equal to 0");
        require(bytes(request.functionName).length > 0, "Function name cannot be empty");
        require(request.category.length > 0, "Category cannot be empty");

        console.log("registerFunction, name: %s sender %s", request.functionName, msg.sender);
        bytes32 functionId = keccak256(abi.encode(request.functionName, msg.sender));
        require(functionMetadatas[functionId].owner == address(0), "Function already exists");
        require(functionExecuteMetadatas[functionId].owner == address(0), "Function already exists");

        //Require function doesn't already exist
        FunctionMetadata memory metadata;
        metadata.owner = msg.sender;
        metadata.name = request.functionName;
        metadata.desc = request.desc;
        metadata.imageUrl = request.imageUrl;
        metadata.expectedArgs = request.expectedArgs;
        metadata.category = request.category;
        metadata.expectedReturnType = request.expectedReturnType;

        FunctionExecuteMetadata memory executeMetadata;
        executeMetadata.owner = msg.sender;
        executeMetadata.fee = request.fees;

        // Create subscription for every Function registered
        if (request.subId == 0) {
            console.log("creating new subscription");
            require(
                LINK.balanceOf(msg.sender) >= minimumSubscriptionBalance,
                "Insufficient LINK balance to fund subscription"
            );
            executeMetadata.subId = createSubscription();
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
            executeMetadata.subId = request.subId;
        }

        // Initialize Functions request into expected format
        Functions.Request memory functionRequest;
        functionRequest.initializeRequest(request.codeLocation, request.language, request.source);
        if (request.secretsLocation == Functions.Location.Remote && request.secrets.length > 0) {
            functionRequest.addRemoteSecrets(request.secrets);
        }

        //Push to collections, starting with metadata for use in the webapp, then metadata used when executing the function and the callback, then last the request collection which is used when executing exclusively.
        functionMetadatas[functionId] = metadata;
        functionExecuteMetadatas[functionId] = executeMetadata;
        functionRequests[functionId] = functionRequest;

        emit FunctionRegistered(
            functionId, msg.sender, metadata.category, metadata, executeMetadata.fee, executeMetadata.subId
        );

        functionsRegisteredCount++;

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
            LINK.transferFrom(msg.sender, address(this), minimumSubscriptionBalance),
            "Failed to transfer LINK to the Function Manager to fund the subscription"
        );

        // Fund subscription with LINK transferAndCall
        require(
            LINK.transferAndCall(address(BILLING_REGISTRY), minimumSubscriptionBalance, abi.encode(subId)),
            "Failed to transfer LINK to Billing Registry to fund the subscription"
        );

        return subId;
    }

    /**
     * @notice Send a simple request, note, you can't specify the gasLimit in this contract because we
     *   haven't yet figured out how best to charge the caller for gas
     *
     * @param functionId Uniquely generated ID from registerFunctions to identify functions
     * @param args List of arguments expected by the Function request
     *
     * @return Functions request ID
     */
    function executeRequest(bytes32 functionId, string[] calldata args) public returns (bytes32) {
        console.log("executeRequest called with functionId:");
        console.logBytes32(functionId);
        FunctionExecuteMetadata memory chainlinkFunction = functionExecuteMetadatas[functionId];
        require(chainlinkFunction.owner != address(0), "function is not registered");

        Functions.Request memory functionRequest = functionRequests[functionId];
        if (args.length > 0) functionRequest.addArgs(args);

        console.log("collecting and locking fees");

        // --- Collect and lock fees ---
        bytes memory emptyBytes;
        FunctionsBillingRegistryInterface.RequestBilling memory emptyRequestBilling;
        uint96 baseFee = BILLING_REGISTRY.getRequiredFee(emptyBytes, emptyRequestBilling);
        uint96 totalFee = baseFee + chainlinkFunction.fee;
        uint64 subId = chainlinkFunction.subId;
        uint96 functionManagerCut = (chainlinkFunction.fee * feeManagerCut) / 100;

        require(
            LINK.allowance(msg.sender, address(this)) >= totalFee,
            "User is not approved to transfer LINK to functions manager"
        );

        console.log("sender %s LINK balance %d", msg.sender, LINK.balanceOf(msg.sender));
        require(LINK.balanceOf(msg.sender) >= totalFee, "You do not have enough LINK to call this function");
        console.log("Transferring %d LINK", totalFee);

        // Doing the below transfer requires running ERC20's approve function first. See tests for example.
        require(LINK.transferFrom(msg.sender, address(this), totalFee), "Failed to collect fees from caller");

        console.log("reserved subscription fee %d", subscriptionBalances[subId]);
        subscriptionBalances[subId] += baseFee;
        functionManagerProfitPool += functionManagerCut;
        chainlinkFunction.lockedProfitPool += chainlinkFunction.fee - functionManagerCut;
        chainlinkFunction.functionsCalledCount++;
        functionsCalledCount++;

        functionExecuteMetadatas[functionId] = chainlinkFunction;

        console.log("sending functions request");
        // bytes32 assignedReqID =
        // keccak256(abi.encodePacked(msg.sender, chainlinkFunction.subId, maxGasLimit, block.timestamp));
        bytes32 assignedReqID = sendRequest(functionRequest, chainlinkFunction.subId, maxGasLimit);
        require(functionResponses[assignedReqID].functionId == bytes32(0), "Request ID already exists");

        // Create FunctionsResponse record
        FunctionResponse memory functionResponse;
        functionResponse.functionId = functionId;
        functionResponse.caller = msg.sender;
        functionResponses[assignedReqID] = functionResponse;

        console.log("emitting FunctionCalled event");
        emit FunctionCalled({
            functionId: functionId,
            caller: msg.sender,
            requestId: assignedReqID,
            owner: chainlinkFunction.owner,
            callbackFunction: bytes32(""),
            baseFee: baseFee,
            fee: chainlinkFunction.fee
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
        console.log("fulfilling request");
        console.log("Checking if %s is authorized to call fulfillRequest", msg.sender);
        require(address(BILLING_REGISTRY) == msg.sender, "Only the  Billing Registry can call fulfillRequest");
        require(functionResponses[requestId].caller != address(0), "Request not found in FunctionsManager");
        require(
            functionExecuteMetadatas[functionResponses[requestId].functionId].owner != address(0),
            "Function not found in FunctionsManager"
        );

        console.log("Checking is %s is authorized to call this function...", msg.sender);
        FunctionResponse memory functionResponse = functionResponses[requestId];
        functionResponse.response = response;
        functionResponse.err = err;
        functionResponses[requestId] = functionResponse;

        FunctionExecuteMetadata memory functionMetadata = functionExecuteMetadatas[functionResponse.functionId];

        console.log("Unlocking fees");
        uint96 unlockAmount = (functionMetadata.fee * (100 - feeManagerCut)) / 100;
        functionMetadata.lockedProfitPool -= unlockAmount;
        functionMetadata.unlockedProfitPool += unlockAmount;
        functionMetadata.totalFeesCollected += unlockAmount;
        totalFeesCollected += unlockAmount;

        // Only err or res will be set, never both, so consider set err as failure
        if (err.length == 0) {
            functionMetadata.successfulResponseCount++;
        } else {
            functionMetadata.failedResponseCount++;
        }
        functionExecuteMetadatas[functionResponse.functionId] = functionMetadata;

        console.log("Finished unlocking fees, checking if need fill subscription");
        //Refill the subscription if necessary, do this in fulfillRequest so the function caller pays for it
        (uint96 balance,,) = BILLING_REGISTRY.getSubscription(functionMetadata.subId);
        if (balance < minimumSubscriptionBalance) {
            refillSubscription(functionMetadata.subId);
        }

        // Emit FunctionCallCompleted event
        emit FunctionCallCompleted({
            functionId: functionResponse.functionId,
            caller: functionResponse.caller,
            requestId: requestId,
            owner: functionMetadata.owner,
            callbackFunction: functionResponse.callbackFunction,
            response: response,
            err: err
        });
    }

    // TODO If we keep this function, we need to let the keeper call it after some function timeout
    function forceUnlockFees(bytes32 functionId) external onlyOwner {
        FunctionExecuteMetadata storage chainlinkFunction = functionExecuteMetadatas[functionId];
        require(chainlinkFunction.owner != address(0), "Function does not exist");
        chainlinkFunction.unlockedProfitPool += chainlinkFunction.lockedProfitPool;
        chainlinkFunction.lockedProfitPool = 0;
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

    function withdrawFunctionsManagerProfitToOwner() external onlyOwner {
        console.log("Withdrawing all fees to FunctionsManager owner %s", owner());
        uint96 amountToTransfer = functionManagerProfitPool;
        functionManagerProfitPool = 0;
        LINK.transfer(owner(), amountToTransfer);
    }

    function withdrawFunctionProfitToAuthor(bytes32 functionId) external {
        require(
            msg.sender == owner() || msg.sender == functionExecuteMetadatas[functionId].owner,
            "Must be FunctionsManager owner or function owner to withdraw profit to function owner"
        );
        uint96 amountToTransfer = functionExecuteMetadatas[functionId].unlockedProfitPool;
        functionExecuteMetadatas[functionId].unlockedProfitPool = 0;
        LINK.transfer(functionExecuteMetadatas[functionId].owner, amountToTransfer);
    }

    function withdrawMultipleFunctionProfitToAuthor(bytes32[] memory functionIds) external {
        for (uint256 i = 0; i < functionIds.length; i++) {
            this.withdrawFunctionProfitToAuthor(functionIds[i]);
        }
    }

    /*
        EVERYTHING BELOW IS MINUTAE, just getting it out of the way of the rest of the code
    */
    function setFeeManagerCut(uint32 _feeManagerCut) external onlyOwner {
        feeManagerCut = _feeManagerCut;
        emit FeeManagerCutUpdated(_feeManagerCut);
    }

    function setMinimumSubscriptionBalance(uint96 _minimumSubBalance) external onlyOwner {
        minimumSubscriptionBalance = _minimumSubBalance;
        emit MinimumSubscriptionBalanceUpdated(_minimumSubBalance);
    }

    function setMaxGasLimit(uint32 _maxGasLimit) external onlyOwner {
        maxGasLimit = _maxGasLimit;
        emit MaxGasLimitUpdated(_maxGasLimit);
    }

    function getFunctionMetadata(bytes32 _functionId) external view returns (FunctionMetadata memory) {
        console.log("getFunction");
        return functionMetadatas[_functionId];
    }

    function getFunctionExecuteMetadata(bytes32 _functionId) external view returns (FunctionExecuteMetadata memory) {
        console.log("getFunction");
        return functionExecuteMetadatas[_functionId];
    }

    function getFunctionResponse(bytes32 _requestId) external view returns (FunctionResponse memory) {
        console.log("getFunctionResponse");
        return functionResponses[_requestId];
    }

    function getSubscriptionBalance(uint64 _subscriptionId) external view returns (uint256) {
        console.log("getSubscriptionBalance");
        return subscriptionBalances[_subscriptionId];
    }

    function calculateFunctionId(string calldata functionName, address owner) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(functionName, owner));
    }

    function calculateFunctionIdFromRequest(FunctionsRegisterRequest memory request, address owner)
        external
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(request.functionName, owner));
    }
}
