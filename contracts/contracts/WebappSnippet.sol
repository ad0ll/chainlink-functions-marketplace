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
        LINK.transferFrom(msg.sender, address(this), 0.5 ether);
        address functionManager = address(functionsManager);
        require(
            LINK.allowance(msg.sender, address(this)) >= 1 ether,
            "User is not approved to transfer LINK to functions manager"
        );
        (bool success, bytes memory result) = functionManager.call(
            abi.encodeWithSignature(
                "executeRequest(address,string[])",
                0x50c53bc7a6a672aaf4a4c1a30474014ccdafdeb54de024197b664cf2b1564ed8,
                ["ethereum", "usd"]
            )
        );

        // require(success, "Failed to call executeRequest function.");

        return abi.decode(result, (bytes32));
    }
}
