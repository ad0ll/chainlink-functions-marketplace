// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {FunctionsClient} from "./functions/FunctionsClient.sol";
import {Functions} from "./functions/Functions.sol";
import {FunctionsBillingRegistry} from "./functions/FunctionsBillingRegistry.sol";
import {FunctionsOracleInterface} from "./functions/interfaces/FunctionsOracleInterface.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract FunctionsManager is Ownable {
    LinkTokenInterface private LINK;
    FunctionsBillingRegistry private BILLING_REGISTRY;
    FunctionsOracleInterface private ORACLE;

    uint256 public functionManagerProfitPool; // The fee manager's cut of fees
    uint256 public baseFee = 10 ** 18 * 0.2; // 0.2 LINK (18 decimals)
    uint32 public feeManagerCut;

    // Permanent storage of function responses
    mapping(bytes32 => FunctionResponse) functionResponses;
    // Mapping of FunctionProxy contract addresses to ChainlinkFunction
    mapping(address => FunctionMetadata) chainlinkFunctions;
    //Currently this is a simple counter that increments when a callback function is invoked
    mapping(bytes32 => uint256) callbackFunctions;

    struct FunctionResponse {
        address caller;
        address proxyAddress;
        bytes32 callbackFunction;
        bytes response;
        bytes err;
    }

    // Functions metadata
    struct FunctionMetadata {
        uint256 fee;
        address owner;
        uint64 subId;
        string name;
        string desc;
        string imageUrl;
        // Subscription fields
        uint256 subscriptionPool; // Reserved base fees collected, can't be withdrawn
        uint256 unlockedProfitPool; // Profits from completed functions, can be withdrawn on demand
        uint256 lockedProfitPool; // Profits from initialized calls that haven't had their callback completed yet
    }

    // TODO: Need to store request during register?
    // Functions.Request request;

    // Event emitted when a Function is registered
    // Recording owner twice isn't ideal, but we want to be able to filter on owner
    event FunctionRegistered(address indexed proxyAddress, address indexed owner, FunctionMetadata metadata);
    event FunctionCalled(
        address indexed proxyAddress,
        address indexed caller,
        bytes32 indexed requestId,
        address owner,
        bytes32 callbackFunction,
        uint256 baseFee,
        uint256 fee
    );

    event FunctionCallCompleted(
        address indexed proxyAddress,
        address indexed caller,
        bytes32 indexed requestId,
        address owner,
        bytes32 callbackFunction,
        bytes response,
        bytes err
    );

    event BaseFeeUpdated(uint256 newBaseFee);
    event FeeManagerCutUpdated(uint256 newFeeManagerCut);
    // Initialize with the Chainlink proxies that are commonly interacted with
    // Good default values for baseFee is 10 ** 18 * 0.2 (0.2 LINK), and for feeManagerCut (5)

    modifier _onlyFunctionOwner(address _proxyAddress) {
        // Require that the person initiating the transaction owns the proxy contract at _proxyAddress
        require(msg.sender == chainlinkFunctions[_proxyAddress].owner, "Not the function owner");
        _;
    }

    modifier _functionExists(address _proxyAddress) {
        // Require that the function exists
        require(chainlinkFunctions[_proxyAddress].owner != address(0), "Function does not exist");
        _;
    }

    modifier _functionNotExists(address _proxyAddress) {
        // Require that the function does not exist
        require(chainlinkFunctions[_proxyAddress].owner == address(0), "Function already exists");
        _;
    }

    constructor(
        address link,
        address billingRegistryProxy,
        address oracleProxy,
        uint256 _baseFee,
        uint32 _feeManagerCut
    ) {
        require(_feeManagerCut <= 100, "Fee manager cut must be less than or equal to 100");
        LINK = LinkTokenInterface(link);
        BILLING_REGISTRY = FunctionsBillingRegistry(billingRegistryProxy);
        ORACLE = FunctionsOracleInterface(oracleProxy);
        baseFee = _baseFee;
        feeManagerCut = _feeManagerCut;
    }

    // FunctionRegistered event - Will have metadata from register function params
    // FunctionCalled event (Probably not used by the webapp)
    // FunctionError event
    // FunctionSuccess event
    function registerFunction(FunctionMetadata memory metadata) public returns (address) {
        // 2. TODO Fund w/ initial deposit if NEW
        // 3. TODO Add self (FunctionManager) to authorized users
        // 4?. Check owner is registered with OracleProxy (i.e is registered in function beta)
        // ??? Ensure interface is correct, probably not important ???

        //Perfrom basic validation on metadata
        console.log("validating function metadata");
        require(metadata.fee >= 0, "Fee must be greater than or equal to 0");
        require(bytes(metadata.name).length > 0, "Function name cannot be empty");
        metadata.owner = msg.sender; // Force owner to sender since sender will own subscription

        // 1. Create a subscription if subId is 0,
        if (metadata.subId == 0) {
            console.log("creating subscription");
            metadata.subId = createSubscription();
            // TODO when we have keepers, authorize the keeper to consume
        }
        // 1.5 TODO Check if subscription exists if supplied

        // 4. Deploy proxy contact, get address
        console.log("deploying FunctionsClient contract");
        address proxy = deployFunctionsProxy(metadata.subId);
        //Below shouldn't be possible since we just deployed the proxy
        require(chainlinkFunctions[proxy].owner == address(0), "Function already registered");

        // 5. Add function to FunctionsManager
        console.log("adding function to FunctionsManager");
        chainlinkFunctions[proxy] = metadata;
        console.log("registered function %s with address %s", metadata.name, proxy);

        // 6. Emit event
        console.log("emitting FunctionRegistered event");
        emit FunctionRegistered(address(proxy), msg.sender, metadata);
        return address(proxy);
    }

    function deployFunctionsProxy(uint64 subId) internal returns (address) {
        console.log("deploying FunctionsClient contract");
        FunctionsClient proxy = new FunctionsClient(address(ORACLE));
        console.log("deployed FunctionsClient contract at address %s", address(proxy));
        return address(proxy);
    }

    function createSubscription() internal returns (uint64) {
        console.log("creating subscription");
        uint64 subId = BILLING_REGISTRY.createSubscription();
        console.log("created subscription with id %s", subId);
        BILLING_REGISTRY.addConsumer(subId, address(this));
        console.log("added the FunctionsManager as a consumer to the subscription");
        // TODO: Fund subscription link transferAndCall
        // TODO register function manager as authorized user
        return subId;
    }

    function executeFunction(address _proxyAddress, bytes32 _callbackFunction) external payable returns (bytes32) {
        FunctionMetadata storage chainlinkFunction = chainlinkFunctions[_proxyAddress];
        require(chainlinkFunction.owner != address(0), "Function does not exist");

        collectAndLockFees(chainlinkFunction);
        // TODO Make the below an actual function call
        bytes32 requestId =
            keccak256(abi.encodePacked(_proxyAddress, chainlinkFunction.name, msg.sender, block.timestamp));

        FunctionResponse memory res = FunctionResponse({
            caller: msg.sender,
            proxyAddress: _proxyAddress,
            callbackFunction: _callbackFunction,
            response: "",
            err: ""
        });
        functionResponses[requestId] = res;
        console.log("calling function %s with caller %s", chainlinkFunction.name, msg.sender);
        emit FunctionCalled({
            proxyAddress: _proxyAddress,
            owner: chainlinkFunction.owner,
            caller: msg.sender,
            requestId: requestId,
            callbackFunction: _callbackFunction,
            baseFee: baseFee,
            fee: chainlinkFunction.fee
        });
        return requestId;
    }

    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal virtual {
        // Emit metrics and return response to the person executing the function through the FuncionsManager
        // We need to make sure that the downstream contract can't conceal execution results since we need it to record metrics.

        FunctionResponse storage functionResponse = functionResponses[requestId];
        require(functionResponse.caller != address(0), "Attempted callback with unknown request ID");
        functionResponse.response = response;
        functionResponse.err = err;

        FunctionMetadata storage chainlinkFunction = chainlinkFunctions[functionResponse.proxyAddress];
        require(chainlinkFunction.owner != address(0), "Function does not exist");
        unlockFees(chainlinkFunction);

        emit FunctionCallCompleted({
            proxyAddress: functionResponse.proxyAddress,
            owner: chainlinkFunction.owner,
            caller: functionResponse.caller,
            callbackFunction: functionResponse.callbackFunction,
            requestId: requestId,
            response: response,
            err: err
        });
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

    function unlockFees(FunctionMetadata storage chainlinkFunction) private {
        // Function manager has already taken its cut, so calculate the amount owed to the function owner
        // by taking the FunctionManager cut from the fee and adding it to the owner profit pool
        uint256 unlockAmount = (chainlinkFunction.fee * (100 - feeManagerCut)) / 100;
        chainlinkFunction.lockedProfitPool -= unlockAmount;
        chainlinkFunction.unlockedProfitPool += unlockAmount;
    }

        // Function that lets you withdraw all of this contracts balance to the FunctionManager owner
    function withdrawContractBalToOwner() external onlyOwner {
        require(msg.sender == owner(), "Only contract owner can withdraw");
        require(LINK.transferFrom(address(this), owner(), functionManagerProfitPool), "Transfer failed");
        functionManagerProfitPool = 0;
    }

    // Full withdrawl of the function owner profit pool to the function owner
    function withdrawProfitToFuncOwner(address _proxyAddress) external _onlyFunctionOwner(_proxyAddress) {
        FunctionMetadata storage chainlinkFunction = chainlinkFunctions[_proxyAddress];
        require(chainlinkFunction.owner == msg.sender, "Only func owner can withdraw");
        require(
            LINK.transferFrom(address(this), chainlinkFunction.owner, chainlinkFunction.unlockedProfitPool),
            "Transfer failed"
        );
        chainlinkFunction.unlockedProfitPool = 0;
    }


    /*
        ----------------------------------------------------
        ALL CODE BELOW IS MINUTIAE FOR THE FUNCTIONS MANAGER
        ----------------------------------------------------
    */

    function setBaseFee(uint256 _baseFee) external onlyOwner {
        baseFee = _baseFee;
        emit BaseFeeUpdated(_baseFee);
    }

    function setFeeManagerCut(uint32 _feeManagerCut) external onlyOwner {
        feeManagerCut = _feeManagerCut;
        emit FeeManagerCutUpdated(_feeManagerCut);
    }

    function getFunction(address _proxyAddress) external view returns (FunctionMetadata memory) {
        console.log("getFunction");
        return chainlinkFunctions[_proxyAddress];
    }

    function getFunctionResponse(bytes32 _requestId) external view returns (FunctionResponse memory) {
        console.log("getFunctionResponse");
        return functionResponses[_requestId];
    }

    function getCallbackFunction(bytes32 _requestId) external view returns (uint256) {
        console.log("getCallbackFunction");
        return callbackFunctions[_requestId];
    }
}
