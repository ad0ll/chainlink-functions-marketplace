// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {FunctionsClient} from "./functions/FunctionsClient.sol";
import {Functions} from "./functions/Functions.sol";
import {FunctionsBillingRegistry} from "./functions/FunctionsBillingRegistry.sol";
import {FunctionsOracleInterface} from "./functions/interfaces/FunctionsOracleInterface.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "hardhat/console.sol";

contract FunctionsManager is FunctionsClient, ConfirmedOwner {
    using Functions for Functions.Request;

    mapping(bytes32 => FunctionsMetadata) private metadataMapping;
    mapping(bytes32 => FunctionsResponse) public responseMapping;
    mapping(bytes32 => bytes32) private requestToFunctionsMapping;
    mapping(uint64 => address) private subscriptionOwnerMapping;

    LinkTokenInterface private LINK;
    FunctionsBillingRegistry private BILLING_REGISTRY;

    uint requestIdNonce;

    struct FunctionsRegisterRequest {
        uint256 fees;
        string functionName;
        string desc;
        string imageUrl;
        Functions.Location codeLocation;
        Functions.Location secretsLocation;
        Functions.CodeLanguage language;
        string source; // Source code for Location.Inline or url for Location.Remote
        bytes secrets; // Encrypted secrets blob for Location.Inline or url for Location.Remote
        string[] args;
    }

    // Functions metadata
    struct FunctionsMetadata {
        uint256 fees;
        address owner;
        string functionName;
        string desc;
        string imageUrl;
        uint64 subId;
        Functions.Request request;
    }

    struct FunctionsResponse {
        bytes32 latestRequestId;
        bytes latestResponse;
        bytes latestError;
    }

    // Event emitted when a Function is registered
    // Recording owner twice isn't ideal, but we want to be able to filter on owner
    event FunctionRegistered(FunctionsMetadata metadata);

    event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

    // Initialize with the Chainlink proxies that are commonly interacted with
    constructor(address link, address billingRegistryProxy, address oracle) FunctionsClient(oracle) ConfirmedOwner(msg.sender) {
        LINK = LinkTokenInterface(link);
        BILLING_REGISTRY = FunctionsBillingRegistry(billingRegistryProxy);
    }

    // FunctionRegistered event - Will have metadata from register function params
    // FunctionCalled event (Probably not used by the webapp)
    // FunctionError event
    // FunctionSuccess event
    function registerFunction(FunctionsRegisterRequest calldata request) public returns (bytes32) {
        FunctionsMetadata memory metadata;

        metadata.owner = msg.sender;
        metadata.fees = request.fees;
        metadata.functionName = request.functionName;
        metadata.desc = request.desc;
        metadata.imageUrl = request.imageUrl;

        // Create subscription for every Function registered
        metadata.subId = createSubscription();

        // Initialize Functions request into expected format
        Functions.Request memory functionsRequest;
        functionsRequest.initializeRequest(request.codeLocation, request.language, request.source);
        if (request.secrets.length > 0) {
            functionsRequest.addRemoteSecrets(request.secrets);
        }
        if (request.args.length > 0) functionsRequest.addArgs(request.args);

        metadata.request = functionsRequest;
        
        // ??? Ensure interface is correct, probably not important ???
        // 5. Add function to FunctionsManager
        // Generate unique functions ID to be able to retrieve requests
        bytes32 functionsId = keccak256(abi.encode(metadata, requestIdNonce++));
        metadataMapping[functionsId] = metadata;

        // Emit FunctionRegistered event
        emit FunctionRegistered(metadata);

        return functionsId;
    }

    function createSubscription() internal returns (uint64) {
        // Automitically sets msg sender (FunctionsManager) as subscription owner
        uint64 subId = BILLING_REGISTRY.createSubscription();
        // Maintaining subscription ownership internally to allow ownership transfer later
        subscriptionOwnerMapping[subId] = msg.sender;

        // Fund subscription with LINK transferAndCall
        LINK.transferAndCall(address(BILLING_REGISTRY), msg.value, abi.encode(subId));

        return subId;
    }

    /**
     * @notice Send a simple request
     *
     * @param functionsId Uniquely generated ID from registerFunctions to identify functions
     * @param gasLimit Maximum amount of gas used to call the client contract's `handleOracleFulfillment` function
     * @return Functions request ID
     */
    function executeRequest(
        bytes32 functionsId,
        uint32 gasLimit
    ) public onlyOwner returns (bytes32) {
        require(bytes(metadataMapping[functionsId].functionName).length == 0 || metadataMapping[functionsId].subId == 0, 'Invalid request ID');
        bytes32 assignedReqID = sendRequest(metadataMapping[functionsId].request, metadataMapping[functionsId].subId, gasLimit);
        
        responseMapping[functionsId].latestRequestId = assignedReqID;
        requestToFunctionsMapping[assignedReqID] = functionsId;
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
        bytes32 functionsId = requestToFunctionsMapping[requestId];
        FunctionsResponse memory functionResponse = responseMapping[functionsId];
        functionResponse.latestResponse = response;
        functionResponse.latestError = err;

        // Delete requestId to functionsId entry to avoid an ever growing mapping
        delete requestToFunctionsMapping[requestId];
        emit OCRResponse(requestId, response, err);
    }

    /**
     * @notice Allows the Functions oracle address to be updated
     *
     * @param oracle New oracle address
     */
    function updateOracleAddress(address oracle) public onlyOwner {
        setOracle(oracle);
    }

    function addSimulatedRequestId(address oracleAddress, bytes32 requestId) public onlyOwner {
        addExternalRequest(oracleAddress, requestId);
    }

    // Request subscription ownership transfer
    // Subscription owner can officially accept transfer through the Billing Registry's acceptSubscriptionOwnerTransfer function
    function requestSubscriptionOwnerTransfer(uint64 subId) external {
        require(subscriptionOwnerMapping[subId] == msg.sender, "Subscription not registered for sender");
        BILLING_REGISTRY.requestSubscriptionOwnerTransfer(subId, msg.sender);
    }
}
