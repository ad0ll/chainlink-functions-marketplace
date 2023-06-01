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

    function registerFunction(FunctionsRegisterRequest calldata request) public payable returns (bytes32);

    function createSubscription() internal returns (uint64);

    /**
     * @notice Send a simple request, note, you can't specify the gasLimit in this contract because we
     *   haven't yet figured out how best to charge the caller for gas
     *
     * @param functionId Uniquely generated ID from registerFunctions to identify functions
     * @param args List of arguments expected by the Function request
     *
     * @return Functions request ID
     */
    function executeRequest(bytes32 functionId, string[] calldata args) public returns (bytes32);
    
    // function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override;

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
