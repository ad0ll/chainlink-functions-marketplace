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

    LinkTokenInterface private LINK;
    FunctionsBillingRegistry private BILLING_REGISTRY;

    uint256 public functionManagerProfitPool; // The fee manager's cut of fees, whole number representing percentage
    uint256 public baseFee = 10 ** 18 * 0.2; // 0.2 LINK (18 decimals)
    uint256 public minimumSubscriptionDeposit = 10 ** 18 * 3; // 3 LINK (18 decimals)
    uint32 public feeManagerCut;

    // TODO Support authorMetadata

    // (Not in this contract) Set keeper threshold at 1 LINK
    struct FunctionsRegisterRequest {
        uint256 fees;
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
        uint256 fee;
        address owner;
        uint64 subId;
        string name;
        string desc;
        string imageUrl;
        string[] expectedArgs;
        Functions.Request request;
        bytes32 category;
        // Subscription fields
        uint256 subscriptionPool; // Reserved base fees collected, can't be withdrawn
        uint256 unlockedProfitPool; // Profits from completed functions, can be withdrawn on demand
        uint256 lockedProfitPool; // Profits from initialized calls that haven't had their callback completed yet
    }

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
        uint256 baseFee,
        uint256 fee
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
        uint256 _baseFee,
        uint32 _feeManagerCut,
        uint256 _minimumSubscriptionDeposit
    ) FunctionsClient(oracleProxy) ConfirmedOwner(msg.sender) {
        require(_feeManagerCut <= 100, "Fee manager cut must be less than or equal to 100");
        LINK = LinkTokenInterface(link);
        BILLING_REGISTRY = FunctionsBillingRegistry(billingRegistryProxy);
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
            metadata.subId = createSubscription();
        } else {
            console.log("using existing subscription %d", request.subId);
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
        require(msg.value >= minimumSubscriptionDeposit, 'Minimum deposit amount not sent');
        console.log("creating subscription with %s as sender and %s as tx.origin", msg.sender, tx.origin);
        // Automatically sets msg sender (FunctionsManager) as subscription owner
        uint64 subId = BILLING_REGISTRY.createSubscription();

        // Add FunctionsManager as a consumer of the subscription
        BILLING_REGISTRY.addConsumer(subId, address(this));

        // Maintaining subscription ownership internally to allow ownership transfer later
        subscriptionOwnerMapping[subId] = msg.sender;
        // TODO Make sure owner can fund subscription. Might not require any changes

        // Fund subscription with LINK transferAndCall
        LINK.transferAndCall(address(BILLING_REGISTRY), msg.value, abi.encode(subId));

        // TODO Transfer minimumSubscriptionDeposit to subscription
        return subId;
    }

    /**
     * @notice Send a simple request
     *
     * @param functionId Uniquely generated ID from registerFunctions to identify functions
     * @param gasLimit Maximum amount of gas used to call the client contract's `handleOracleFulfillment` function
     * @return Functions request ID
     */
    //TODO Needs to take args as a parameter
    function executeRequest(bytes32 functionId, string[] calldata args, uint32 gasLimit) public onlyOwner returns (bytes32) {
        console.log("executeRequest called with functionId:");
        console.logBytes32(functionId);
        FunctionMetadata storage chainlinkFunction = functionMetadatas[functionId];
        require(bytes(chainlinkFunction.name).length != 0, "function is not registered");

        Functions.Request memory functionsRequest = chainlinkFunction.request;
        if (args.length > 0) functionsRequest.addArgs(args);

        console.log("collecting and locking fees");
        collectAndLockFees(chainlinkFunction);
        console.log("sending functions request");
        bytes32 assignedReqID = sendRequest(functionsRequest, chainlinkFunction.subId, gasLimit);
        
        console.log("requestId is:");
        console.logBytes32(assignedReqID);
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
        // Require response is registered

        FunctionResponse storage functionResponse = functionResponses[requestId];
        require(functionResponse.caller != address(0), "Invalid request ID");
        functionResponse.response = response;
        functionResponse.err = err;

        FunctionMetadata storage chainlinkFunction = functionMetadatas[functionResponse.functionId];
        require(chainlinkFunction.owner != address(0), "Function does not exist");
        unlockFees(chainlinkFunction);

        // Emit FunctionCallCompleted event
        emit FunctionCallCompleted({
            functionId: requestId,
            caller: functionResponse.caller,
            requestId: requestId,
            owner: chainlinkFunction.owner,
            callbackFunction: functionResponse.callbackFunction,
            response: response,
            err: err,
            usedGas: 0
        });

        // Delete requestId to functionId entry to avoid an ever growing mapping
        emit OCRResponse(requestId, response, err);
    }

    function collectAndLockFees(FunctionMetadata storage chainlinkFunction) private {
        console.log("sender %s LINK balance %d", msg.sender, LINK.balanceOf(msg.sender));
        require(
            LINK.balanceOf(msg.sender) >= baseFee + chainlinkFunction.fee,
            "You do not have enough LINK to call this function"
        );

        // Doing the below transfer requires running ERC20's approve function first. See tests for example.
        require(
            LINK.transferFrom(msg.sender, address(this), chainlinkFunction.fee), "Failed to collect fees from caller"
        );

        chainlinkFunction.subscriptionPool = chainlinkFunction.subscriptionPool + baseFee;
        console.log(
            "added baseFee %d LINK to subscription pool, total in pool: %d", baseFee, chainlinkFunction.subscriptionPool
        );

        uint256 functionManagerCut = (chainlinkFunction.fee * feeManagerCut) / 100;
        functionManagerProfitPool = functionManagerProfitPool + functionManagerCut;
        console.log(
            "took %d from fee of %d LINK and added to feeManagerProfitPool, total in pool: %d ",
            functionManagerCut,
            chainlinkFunction.fee,
            functionManagerProfitPool
        );
    }

    function unlockFees(FunctionMetadata storage chainlinkFunction) private onlyOwner {
        // Function manager has already taken its cut, so calculate the amount owed to the function owner
        // by taking the FunctionManager cut from the fee and adding it to the owner profit pool
        uint256 unlockAmount = (chainlinkFunction.fee * (100 - feeManagerCut)) / 100;
        chainlinkFunction.lockedProfitPool -= unlockAmount;
        chainlinkFunction.unlockedProfitPool += unlockAmount;
    }

    // TODO If we keep this function, we need to let the keeper call it
    function forceUnlockFees(bytes32 functionId) external onlyOwner {
        FunctionMetadata storage chainlinkFunction = functionMetadatas[functionId];
        require(chainlinkFunction.owner != address(0), "Function does not exist");
        unlockFees(chainlinkFunction);
    }

    // TODO Should not exist
    function moveSubscriptionToUnlock(bytes32 functionId) external {
        FunctionMetadata storage chainlinkFunction = functionMetadatas[functionId];
        require(chainlinkFunction.owner != address(0), "Function does not exist");
        chainlinkFunction.unlockedProfitPool += chainlinkFunction.subscriptionPool;
        chainlinkFunction.subscriptionPool = 0;
    }

    // TODO This function should no
    // Remove me later, lets us manually fulfill requests
    function dummyFullfill(bytes32 requestId, bytes memory response, bytes memory err) public onlyOwner {
        fulfillRequest(requestId, response, err);
    }
    /*
        EVERYTHING BELOW IS MINUTAE
    */

    function setBaseFee(uint256 _baseFee) external onlyOwner {
        baseFee = _baseFee;
        emit BaseFeeUpdated(_baseFee);
    }

    function setFeeManagerCut(uint32 _feeManagerCut) external onlyOwner {
        feeManagerCut = _feeManagerCut;
        emit FeeManagerCutUpdated(_feeManagerCut);
    }

    function setMinimumDeposit(uint256 _minimumDeposit) external onlyOwner {
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
}
