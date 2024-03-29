pragma solidity ^0.8.18;

interface LinkTokenInterface {
    function allowance(address owner, address spender) external view returns (uint256 remaining);
    function approve(address spender, uint256 value) external returns (bool success);
    function balanceOf(address owner) external view returns (uint256 balance);
    function transferFrom(address from, address to, uint256 value) external returns (bool success);
}

interface FunctionsManagerInterface {
    function executeRequest(bytes32 functionId, string[] calldata args) external returns (bytes32);
}

contract WebappSnippet2 {
    LinkTokenInterface linkToken = LinkTokenInterface(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
    FunctionsManagerInterface functionsManager = FunctionsManagerInterface(0xac427515A3897E1321F4d50e15e267c4B7120e00);

    constructor() {
        linkToken.approve(address(functionsManager), 1_000_000_000 ether);
    }

    function sendRequest() public returns (bytes32) {
        require(
            linkToken.allowance(msg.sender, address(this)) >= 0.3 ether,
            "(Snippet) User is not approved to transfer LINK to the FunctionsManager"
        );
        require(linkToken.balanceOf(msg.sender) >= 0.3 ether, "(Snippet) User does not have enough LINK");
        linkToken.transferFrom(msg.sender, address(this), 0.3 ether);

        string[] memory args = new string[](2);
        args[0] = "ethereum";
        args[1] = "usd";
        return functionsManager.executeRequest(0x4384ec9b548391dcd7fc8a9fdcaa6b1a196aca144fc9b515500aac41964f02ea, args);
    }
}
