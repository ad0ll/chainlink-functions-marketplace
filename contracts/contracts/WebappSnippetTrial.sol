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


contract Snippet {


    LinkTokenInterface linkToken;

    FunctionsManagerInterface functionsManager;


    constructor(address _linkToken, address _functionsManager) {

        linkToken = LinkTokenInterface(_linkToken);

        functionsManager = FunctionsManagerInterface(_functionsManager);

        linkToken.approve(address(functionsManager), 1_000_000_000 ether);

    }


    /// @notice Sends a request to the CoinGecko Price (Demo) integration

    /// @param base The base currency of the price pair

    /// @param quote The target currency of the price pair

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


        return functionsManager.executeRequest(0x4384ec9b548391dcd7fc8a9fdcaa6b1a196aca144fc9b515500aac41964f02ea, args);

    }

    

}