/*
* Local copy of the snippet you see in the webapp, used to test that it compiles and runs
*/
pragma solidity ^0.8.18;

interface LinkTokenInterface {
    function allowance(address owner, address spender) external view returns (uint256 remaining);

    function approve(address spender, uint256 value) external returns (bool success);

    function balanceOf(address owner) external view returns (uint256 balance);

    function transferFrom(address from, address to, uint256 value) external returns (bool success);
}

interface FunctionsManagerInterface {
    function executeRequest(bytes32 functionId, string[] calldata args) external returns (bytes32);

    function getFunctionResponseValue(bytes32 requestId) external returns (bytes memory);
}

contract Snippet {

    LinkTokenInterface linkToken = LinkTokenInterface(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
    FunctionsManagerInterface functionsManager = FunctionsManagerInterface(0x3744551b069e845B3E1A2832a17F7175Fcf2CB96);

    constructor() {
        linkToken = LinkTokenInterface(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        functionsManager = FunctionsManagerInterface(0x3744551b069e845B3E1A2832a17F7175Fcf2CB96);
        linkToken.approve(address(functionsManager), 1_000_000_000 ether);
    }

    /// @notice Sends a request to the CoinGecko Price (Demo) integration
    /// @param _base The base currency of the price pair
    /// @param _quote The target currency of the price pair
    /// @return A requestId that can be used to retrieve an array of bytes representing 
    //          a/an buffer once the request is fulfilled
    function sendRequest(string calldata _base, string calldata _quote) public returns (bytes32) {
        require(
            linkToken.allowance(msg.sender, address(this)) >= 0.25 ether,
            "(Snippet) User is not approved to transfer LINK to the FunctionsManager"
        );
        require(linkToken.balanceOf(msg.sender) >= 0.25 ether, "(Snippet) User does not have enough LINK");
        linkToken.transferFrom(msg.sender, address(this), 0.25 ether);
        string[] memory args = new string[](2);
        args[0] = _base;
        args[1] = _quote;

        return functionsManager.executeRequest(0x1cad7a1167bd441b2a8e30bbd40637f03ace876976424bdadce5e8d2b7edd012, args);
    }

    function readResult(bytes32 _requestId) public returns (uint256){
        return bytesToUint(functionsManager.getFunctionResponseValue(_requestId));
    }

    // THIS FUNCTION ADDED FOR THE DEMO ONLY
    function bytesToUint(bytes memory b) internal pure returns (uint256){
        uint256 number;
        for (uint i = 0; i < b.length; i++) {
            number = number + uint(uint8(b[i])) * (2 ** (8 * (b.length - (i + 1))));
        }
        return number;
    }

}