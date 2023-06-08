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

    // Balances that can be dumped into a subscription when the subscription balance runs low
    mapping(uint64 => uint96) public subscriptionBalances;

    // mapping(bytes32 => FeePool) public feePools;
    LinkTokenInterface private LINK;
    FunctionsBillingRegistry private BILLING_REGISTRY;
    FunctionsOracleInterface private ORACLE_PROXY;

    uint96 public minimumSubscriptionBalance; // 1 LINK (18 decimals)
    uint96 public functionManagerProfitPool; // The fee manager's cut of fees, whole number representing percentage
    uint32 public feeManagerCut;

    // Global metrics
    uint64 public functionsRegisteredCount;
    uint96 public functionsCalledCount;
    uint96 public totalFeesCollected;
    uint32 public maxGasLimit; //Leave this at 300k, see service limits doc

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

    // Functions metadata, used for display and snippet generation in the webapp
    struct FunctionMetadata {
        bytes32 functionId;
        address owner;
        bytes32 category;
        ReturnTypes expectedReturnType;
        Functions.Location codeLocation;
        Functions.Location secretsLocation;
        Functions.CodeLanguage language;
        string name;
        string desc;
        string imageUrl;
        string source; // Source code for Location.Inline or url for Location.Remote
        string[] expectedArgs;
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

    struct FunctionResponse {
        bytes32 functionId;
        address caller;
        bytes32 callbackFunction;
        string[] args;
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
        uint96 fee,
        string[] args
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
        address _link,
        address _billingRegistryProxy,
        address _oracleProxy,
        uint32 _feeManagerCut,
        uint96 _minimumSubscriptionBalance,
        uint32 _maxGasLimit
    ) FunctionsClient(_oracleProxy) ConfirmedOwner(msg.sender) {
        require(_feeManagerCut <= 100, "Fee manager cut must be less than or equal to 100");
        LINK = LinkTokenInterface(_link);
        BILLING_REGISTRY = FunctionsBillingRegistry(_billingRegistryProxy);
        ORACLE_PROXY = FunctionsOracleInterface(_oracleProxy);
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
        metadata.functionId = functionId;
        metadata.owner = msg.sender;
        metadata.name = request.functionName;
        metadata.desc = request.desc;
        metadata.imageUrl = request.imageUrl;
        metadata.expectedArgs = request.expectedArgs;
        metadata.category = request.category;
        metadata.expectedReturnType = request.expectedReturnType;
        metadata.codeLocation = request.codeLocation;
        metadata.secretsLocation = request.secretsLocation;
        metadata.language = request.language;
        metadata.source = request.source;

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
        // require(false, "the ability to create subscriptions is explicitly disabled in this version of the contract");
        // Automatically sets msg sender (FunctionsManager) as subscription owner
        uint64 subId = BILLING_REGISTRY.createSubscription();
        console.log("created subscription with id %d", subId);

        console.log("adding %s as consumer", address(this));
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

        if (msg.sender != chainlinkFunction.owner) {
            console.log("caller is not the owner, collecting fees");
            functionManagerProfitPool += functionManagerCut;
            chainlinkFunction.lockedProfitPool += chainlinkFunction.fee - functionManagerCut;
        }

        chainlinkFunction.functionsCalledCount++;
        functionsCalledCount++;

        functionExecuteMetadatas[functionId] = chainlinkFunction;

        console.log("sending functions request");
        bytes32 assignedReqID = sendRequest(functionRequest, chainlinkFunction.subId, maxGasLimit);
        require(functionResponses[assignedReqID].functionId == bytes32(0), "Request ID already exists");

        // Create FunctionsResponse record
        FunctionResponse memory functionResponse;
        functionResponse.functionId = functionId;
        functionResponse.caller = msg.sender;
        functionResponse.args = args;
        functionResponses[assignedReqID] = functionResponse;

        console.log("emitting FunctionCalled event");
        emit FunctionCalled({
            functionId: functionId,
            caller: msg.sender,
            requestId: assignedReqID,
            owner: chainlinkFunction.owner,
            callbackFunction: bytes32(""),
            baseFee: baseFee,
            fee: chainlinkFunction.fee,
            args: args
        });

        return assignedReqID;
    }

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

        if (functionExecuteMetadatas[functionResponses[requestId].functionId].owner != functionResponse.caller) {
            if (functionExecuteMetadatas[functionResponses[requestId].functionId].owner != functionResponse.caller) {
                uint96 unlockAmount = (functionMetadata.fee * (100 - feeManagerCut)) / 100;
                functionMetadata.lockedProfitPool -= unlockAmount;
                functionMetadata.unlockedProfitPool += unlockAmount;
                functionMetadata.totalFeesCollected += unlockAmount;
                totalFeesCollected += unlockAmount;
            }

            // Only err or res will be set, never both, so consider set err as failure
            if (err.length == 0) {
                functionMetadata.successfulResponseCount++;
            } else {
                functionMetadata.failedResponseCount++;
            }
            functionExecuteMetadatas[functionResponse.functionId] = functionMetadata;

            console.log("Finished unlocking fees, checking if need fill subscription");
            //Refill the subscription if necessary, do this in fulfillRequest so the function caller pays for it
        }

        (uint96 balance,,) = BILLING_REGISTRY.getSubscription(functionMetadata.subId);
        console.log("Subscription balance %d", balance);
        console.log("Minimum subscription balance %d", minimumSubscriptionBalance);
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

    function refillSubscription(uint64 _subscriptionId) public {
        // TODO, this call is going to be EXPENSIVE
        console.log("using existing subscription %d, checking if authorized", _subscriptionId);
        (, address owner, address[] memory consumers) = BILLING_REGISTRY.getSubscription(_subscriptionId);
        bool callerAuthorized = msg.sender == address(this) || msg.sender == address(BILLING_REGISTRY)
            || msg.sender == address(ORACLE_PROXY);
        if (!callerAuthorized) {
            for (uint256 i = 0; i < consumers.length; i++) {
                if (consumers[i] == msg.sender) {
                    callerAuthorized = true;
                    break;
                }
            }
        }
        require(callerAuthorized, "Only the owner or an authorized consumer of the subscription can refill it");

        // If we decide to have shift to letting any authorized consumer refill, comment line above and uncomment below
        // bool callerIsAuthorized = owner == msg.sender;
        // if (!callerIsAuthorized) {
        //     //iterate over consumers to see if any of them are address(this)
        //     for (uint256 i = 0; i < consumers.length; i++) {
        //         if (consumers[i] == msg.sender) {
        //             callerIsAuthorized = true;
        //             break
        //         }
        //     }
        // }
        // require(callerIsAuthorized, "Only the owner or an authorized consumer of the subscription can refill it");
        // require(
        //     functionsManagerIsAuthorized && callerIsAuthorized,
        //     "FunctionsManager and/or caller are not authorized consumers of the subscription"
        // );
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
            msg.sender == address(this) || msg.sender == owner()
                || msg.sender == functionExecuteMetadatas[functionId].owner,
            "Must be FunctionsManager, FunctionsManager owner, or function owner to withdraw profit to function owner"
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
        return functionMetadatas[_functionId];
    }

    function getFunctionExecuteMetadata(bytes32 _functionId) external view returns (FunctionExecuteMetadata memory) {
        return functionExecuteMetadatas[_functionId];
    }

    function getFunctionResponse(bytes32 _requestId) external view returns (FunctionResponse memory) {
        return functionResponses[_requestId];
    }

    // Shortcut function, used so we don't have to fetch the return type in the app.
    function getFunctionResponseWithReturnType(bytes32 _requestId)
        external
        view
        returns (FunctionResponse memory, ReturnTypes)
    {
        FunctionResponse memory res = functionResponses[_requestId];
        FunctionMetadata memory meta = functionMetadatas[res.functionId];
        return (res, meta.expectedReturnType);
    }

    function getSubscriptionBalance(uint64 _subscriptionId) external view returns (uint256) {
        return subscriptionBalances[_subscriptionId];
    }
}
