// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {FunctionsClientInterface} from "../functions/interfaces/FunctionsClientInterface.sol";
import {Functions} from "../functions/Functions.sol";
import "hardhat/console.sol";

interface FunctionsManagerInterface is FunctionsClientInterface {
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

    struct FunctionResponse {
        bytes32 functionId;
        address caller;
        bytes32 callbackFunction;
        bytes response;
        bytes err;
    }

    function registerFunction(FunctionsRegisterRequest calldata request) external payable returns (bytes32);

    function executeRequest(bytes32 functionId, string[] calldata args) external returns (bytes32);
    // function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override;

    // Refills the subscription with all funds we have reserved
    function refillSubscription(uint64 _subscriptionId) external;

    function withdrawFunctionsManagerProfitToOwner() external;

    function withdrawFunctionProfitToAuthor(bytes32 functionId) external;

    function withdrawMultipleFunctionProfitToAuthor(bytes32[] memory functionIds) external;
}
