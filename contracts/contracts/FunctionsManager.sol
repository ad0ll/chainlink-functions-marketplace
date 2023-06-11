/*
This is the contract backend for the Functions Marketplace product. It's used to store and run Chainlink Functions
based integrations.
*/
pragma solidity ^0.8.18;

import {FunctionsClient} from "./functions/FunctionsClient.sol";
import {Functions} from "./functions/Functions.sol";
import {LocalFunctionsBillingRegistryInterface} from "./interfaces/LocalFunctionsBillingRegistryInterface.sol";
import {FunctionsOracleInterface} from "./functions/interfaces/FunctionsOracleInterface.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

import "hardhat/console.sol";

contract FunctionsManager is FunctionsClient, ConfirmedOwner {
    using Functions for Functions.Request;

    // functionMetadatas contains presentation metadata and configuration used for the webapp
    mapping(bytes32 => FunctionMetadata) public functionMetadatas;
    // functionExecuteMetadatas contains metadata that's required to run a Chainlink Functions based integration
    mapping(bytes32 => FunctionExecuteMetadata) public functionExecuteMetadatas;
    // Our main callback stores the Chainlink Function response in this collection
    mapping(bytes32 => FunctionResponse) public functionResponses;
    // This is a collection of prebuilt Function.Request(s). It's kept separate from execute metadata since we need it when calling but don't need it when storing the response.
    mapping(bytes32 => Functions.Request) private functionRequests;
    mapping(uint64 => address) private subscriptionOwnerMapping;

    // Balances containing reserved fees that can be dumped into a subscription when the subscription balance runs low
    mapping(uint64 => uint96) public subscriptionBalances;

 

    //FunctionsManager configuration
    LinkTokenInterface private LINK;
    LocalFunctionsBillingRegistryInterface private BILLING_REGISTRY;
    FunctionsOracleInterface private ORACLE_PROXY;
    uint96 public minimumSubscriptionBalance;
    uint96 public functionManagerProfitPool; // The profits earned by the FunctionsManager, incremented by the (feeManagerCut/100) * premiumFee on each call
    uint32 public feeManagerCut; // What percent the FunctionsManager takes from the premium fee. Should be a whole number representing percentage
    uint32 public maxGasLimit; //Leave this at 300k, see service limits doc


    // Global metrics
    uint64 public functionsRegisteredCount;
    uint96 public functionsCalledCount;
    uint96 public totalFeesCollected; 
    
    
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
        // string source; // Source code for Location.Inline or url for Location.Remote
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
        uint96 premiumFee;
        uint96 baseFee;
        uint96 functionsManagerCut;
        // uint96 gasReserve;
        string[] args;
        bytes response;
        bytes err;
    }

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
        // uint96 gasReserve,
        uint96 functionsManagerCut,
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
        BILLING_REGISTRY = LocalFunctionsBillingRegistryInterface(_billingRegistryProxy);
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
        // metadata.source = request.source;

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
        require(false, "the ability to create subscriptions is explicitly disabled in this version of the contract");
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
        FunctionExecuteMetadata memory executeMetadata = functionExecuteMetadatas[functionId];
        require(executeMetadata.owner != address(0), "function is not registered");

        Functions.Request memory functionRequest = functionRequests[functionId];
        if (args.length > 0) functionRequest.addArgs(args);

        console.log("collecting and locking fees");

        // --- Collect and lock fees ---
        bytes memory emptyBytes;
        LocalFunctionsBillingRegistryInterface.RequestBilling memory emptyRequestBilling;
        uint96 baseFee = BILLING_REGISTRY.getRequiredFee(emptyBytes, emptyRequestBilling);
        uint96 premiumFee = executeMetadata.fee;
        if (msg.sender == executeMetadata.owner) {
            premiumFee = 0;
        }
        uint96 totalFee = baseFee + premiumFee;
        uint64 subId = executeMetadata.subId;

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

        uint96 functionManagerCut = (executeMetadata.fee * feeManagerCut) / 100;
        // uint96 gasReserve = (maxGasLimit * 25 gwei); // TODO, not ideal leaving this fixed, just short on time
        // subscriptionBalances[subId] += baseFee + gasReserve;
        subscriptionBalances[subId] += baseFee;
        functionManagerProfitPool += functionManagerCut;
        executeMetadata.lockedProfitPool += premiumFee - functionManagerCut;
        // executeMetadata.lockedProfitPool += premiumFee - functionManagerCut - gasReserve;
        executeMetadata.functionsCalledCount++;
        functionsCalledCount++;

        functionExecuteMetadatas[functionId] = executeMetadata;

        console.log("sending functions request");
        bytes32 assignedReqID = sendRequest(functionRequest, executeMetadata.subId, maxGasLimit);
        require(functionResponses[assignedReqID].functionId == bytes32(0), "Request ID already exists");

        // Create FunctionsResponse record
        FunctionResponse memory functionResponse;
        functionResponse.functionId = functionId;
        functionResponse.caller = msg.sender;
        functionResponse.args = args;
        functionResponse.baseFee = baseFee;
        functionResponse.premiumFee = premiumFee;
        // functionResponse.gasReserve = gasReserve;
        functionResponse.functionsManagerCut = functionManagerCut;
        functionResponses[assignedReqID] = functionResponse;

        console.log("emitting FunctionCalled event");
        emit FunctionCalled({
            functionId: functionId,
            caller: msg.sender,
            requestId: assignedReqID,
            owner: executeMetadata.owner,
            callbackFunction: bytes32(""),
            baseFee: baseFee,
            fee: premiumFee,
            // gasReserve: gasReserve,
            functionsManagerCut: functionManagerCut,
            args: args
        });

        return assignedReqID;
    }

    // This function is called by the FunctionsBillingRegistry (one of the Chainlink Functions) some time after the DON has finished executing the function. It closes out the request that was started in executeRequest by unlocking the premium fee, storing the response, and ticking metrics.
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        // The FunctionsBillingRegistry is the only entrypoint to fulfill a request
        require(address(BILLING_REGISTRY) == msg.sender, "Only the  Billing Registry can call fulfillRequest");
        require(functionResponses[requestId].caller != address(0), "Request not found in FunctionsManager");
        require(
            functionExecuteMetadatas[functionResponses[requestId].functionId].owner != address(0),
            "Function not found in FunctionsManager"
        );

        FunctionResponse memory functionResponse = functionResponses[requestId];
        functionResponse.response = response;
        functionResponse.err = err;
        functionResponses[requestId] = functionResponse;

        FunctionExecuteMetadata memory executeMetadata = functionExecuteMetadatas[functionResponse.functionId];

        // If the owner was the caller, premiumFee and functionsManagerCut will both be 0
        uint96 unlockAmount = functionResponse.premiumFee - functionResponse.functionsManagerCut;
        executeMetadata.lockedProfitPool -= unlockAmount;
        executeMetadata.unlockedProfitPool += unlockAmount;
        executeMetadata.totalFeesCollected += unlockAmount;
        totalFeesCollected += unlockAmount;
        console.log("Finished unlocking fees, checking if need fill subscription");

        // Only err or res will be set, never both, so consider set err as failure
        if (err.length == 0) {
            executeMetadata.successfulResponseCount++;
        } else {
            executeMetadata.failedResponseCount++;
        }

        functionExecuteMetadatas[functionResponse.functionId] = executeMetadata;

        (uint96 balance,,) = BILLING_REGISTRY.getSubscription(executeMetadata.subId);
        if (balance < minimumSubscriptionBalance) {
            refillSubscription(executeMetadata.subId);
        }

        emit FunctionCallCompleted({
            functionId: functionResponse.functionId,
            caller: functionResponse.caller,
            requestId: requestId,
            owner: executeMetadata.owner,
            callbackFunction: functionResponse.callbackFunction,
            response: response,
            err: err
        });
    }

    // This is an override that we use to force unlock fees for a function, only intended for development.
    function forceUnlockFees(bytes32 functionId) external onlyOwner {
        FunctionExecuteMetadata storage chainlinkFunction = functionExecuteMetadatas[functionId];
        require(chainlinkFunction.owner != address(0), "Function does not exist");
        chainlinkFunction.unlockedProfitPool += chainlinkFunction.lockedProfitPool;
        chainlinkFunction.lockedProfitPool = 0;
    }

    // This is behind the "TRANSFER" button on the owner dashboard and our subscription balance check in
    // fulfillRequest. It dumps the reserved fees into the Chainlink Functions subscription.
    // If the owner is inclined, then can withdraw the fees from the subscription to their wallet
    // using Chainlink's contracts, so empowers owners to force withdraw their held fees if they want (at the peril of the reliability of their integration)
    function refillSubscription(uint64 _subscriptionId) public {
        console.log("using existing subscription %d, checking if authorized", _subscriptionId);
        (, address owner, address[] memory consumers) = BILLING_REGISTRY.getSubscription(_subscriptionId);
        bool callerAuthorized = msg.sender == address(this) || msg.sender == address(BILLING_REGISTRY)
            || msg.sender == address(ORACLE_PROXY) || msg.sender == owner;
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
        require(LINK.transfer(owner(), amountToTransfer), "failed to transfer link to FunctionsManager owner");
    }

    // This function is behind "WITHDRAW" in the webapp
    function withdrawFunctionProfitToAuthor(bytes32 functionId) external {
        require(
            msg.sender == address(this) || msg.sender == owner()
                || msg.sender == functionExecuteMetadatas[functionId].owner,
            "Must be FunctionsManager, FunctionsManager owner, or function owner to withdraw profit to function owner"
        );
        uint96 amountToTransfer = functionExecuteMetadatas[functionId].unlockedProfitPool;
        functionExecuteMetadatas[functionId].unlockedProfitPool = 0;
        require(LINK.transfer(functionExecuteMetadatas[functionId].owner, amountToTransfer), "failed to transfer link to function owner");
    }

    // This function is behind "WITHDRAW ALL" in the webapp
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

    function getFunctionResponseValue(bytes32 _requestId) external view returns (bytes memory) {
        if (functionResponses[_requestId].err.length > 0) {
            return functionResponses[_requestId].err;
        }
        return functionResponses[_requestId].response;
    }

    function getSubscriptionBalance(uint64 _subscriptionId) external view returns (uint256) {
        return subscriptionBalances[_subscriptionId];
    }

    // From: https://ethereum.stackexchange.com/questions/136122/how-to-get-gas-price-in-solidity-smart-contract
    function getGasPrice() public view returns (uint256) {
        uint256 gasPrice;
        assembly {
            gasPrice := gasprice()
        }
        return gasPrice;
    }
}
