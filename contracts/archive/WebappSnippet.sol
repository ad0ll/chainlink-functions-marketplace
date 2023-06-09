pragma solidity ^0.8.18;

import {FunctionsManagerInterface} from "./FunctionsManagerInterface.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract WebappSnippet {
    FunctionsManagerInterface functionsManager;
    LinkTokenInterface private LINK;

    constructor(address _functionsManager, address _linkToken) {
        functionsManager = FunctionsManagerInterface(_functionsManager);
        LINK = LinkTokenInterface(_linkToken);
    }

    function approveThis() public {
        LINK.approve(address(functionsManager), 10 ether);
    }

    function sendRequest() public returns (bytes32) {
        address functionManager = address(functionsManager);
        require(
            LINK.allowance(msg.sender, address(this)) >= 1 ether,
            "User is not approved to transfer LINK to functions manager"
        );
        string[] memory args = new string[](2);
        args[0] = "ethereum";
        args[1] = "usd";
        (bool success, bytes memory result) = functionManager.call(
            abi.encodeWithSignature(
                "executeRequest(bytes32,string[])",
                0x4384ec9b548391dcd7fc8a9fdcaa6b1a196aca144fc9b515500aac41964f02ea,
                args
            )
        );

        // require(success, "Failed to call executeRequest function.");

        return abi.decode(result, (bytes32));
    }
}
