pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

// import "@chainlink/contracts/src/v0.4/LinkToken.sol";

// import "forge-std/console.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import "hardhat/console.sol";
// import "interfaces/FeeManagerInterface.sol";

// See https://docs.openzeppelin.com/contracts/4.x/api/token/erc777#ERC777 for details on ERC777 tokens (finished version of ERC-677)

//TODO we can implement IERC777Recepient to let users pre-deposit instead of doing a transfer on every function call
// contract FeeManager is Ownable, IERC777Recipient {
contract FeeManager is Ownable {
    // Numeric field representing the contract holder profit pool
    uint256 public feeManagerProfitPool;
    uint256 public baseFee = 2000000000000000000; //TODO can we get this from the chainlink contract?
    uint32 public feeManagerCut;
    address public linkAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    LinkTokenInterface private linkToken = LinkTokenInterface(linkAddress);

    struct FunctionMetadata {
        address owner;
        uint64 subId;
        uint256 fee;
        string name;
        string description;
        string imageUrl;
        uint256 subscriptionPool; //Owner cannot withdraw this unless they delete their function (deleting function probably won't make it into the hackathon)
        uint256 unlockedProfitPool; //Owner can withdraw this at will
        uint256 lockedProfitPool; //Profits are unlocked when the proxy contract uses the FunctionManager to fullfill the callback
    }

    struct FunctionResponse {
        address caller;
        address proxyAddress;
        bytes32 callbackFunction;
        bytes response;
        bytes err;
    }


    // Permanent storage of function responses
    mapping(bytes32 => FunctionResponse) functionResponses;
    // Mapping of FunctionProxy contract addresses to ChainlinkFunction
    mapping(address => FunctionMetadata) chainlinkFunctions;
    //Currently this is a simple counter that increments when a callback function is invoked
    mapping(bytes32 => uint256) callbackFunctions;

    event FunctionRegistered(address indexed proxyAddress, address indexed owner, FunctionMetadata metadata);

    //TIL max number of indexed fields is 3 unless you use an anonymous event, which lets you do 4
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


    modifier _onlyFunctionOwner(address _proxyAddress) {
        // Require that the person initiating the transaction owns the proxy contract at _proxyAddress
        require(msg.sender == chainlinkFunctions[_proxyAddress].owner, "Not the function owner");
        _;
    }

    constructor(address _linkTokenAddress, uint256 _baseFee, uint32 _feeManagerCut) {
        linkAddress = _linkTokenAddress;
        linkToken = LinkTokenInterface(linkAddress);
        baseFee = _baseFee;
        feeManagerCut = _feeManagerCut;
    }

    // Function that lets you change the baseFee
    function setBaseFee(uint256 _baseFee) external onlyOwner {
        baseFee = _baseFee;
    }

    // Function that lets you change the feeManagerCut
    function setFeeManagerCut(uint32 _feeManagerCut) external onlyOwner {
        feeManagerCut = _feeManagerCut;
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

    //The _proxyAddress is the address functions proxy contract that we help the owner deploy
    function registerFunction(address _proxyAddress, string calldata _name, string calldata _description, uint256 _fee)
        external
    {
        console.log("registering function %s with address", _name, _proxyAddress);
        // Require that the function doesn't already exist
        // Require that the person initiating the transaction owns the proxy contract at _proxyAddress
        // Create a new ChainlinkFunction with the given parameters

        //TODO Assert the person calling this is the owner of proxy contract

        //Require fee is greater than 0
        require(_fee >= 0, "Fee must be greater than or equal to 0");
        //Require function name cannot be empty
        require(bytes(_name).length > 0, "Function name cannot be empty");
        //Require function doesn't already exist
        require(chainlinkFunctions[_proxyAddress].owner == address(0), "Function already registeres");

        // Add the ChainlinkFunction to chainlinkFunctions
        FunctionMetadata memory newFunction = FunctionMetadata({
            owner: msg.sender,
            name: _name,
            description: _description,
            fee: _fee,
            subId: 0,
            imageUrl: "",
            subscriptionPool: 0,
            unlockedProfitPool: 0,
            lockedProfitPool: 0
        });
        chainlinkFunctions[_proxyAddress] = newFunction;
        emit FunctionRegistered({proxyAddress: _proxyAddress, owner: msg.sender, metadata: newFunction});
    }

    // TODO needs to take gas deposit
    function callFunction(address _proxyAddress, bytes32 _callbackFunction) external payable returns (bytes32) {
        // Get the function from chainlinkFunctions, require it exists
        FunctionMetadata storage chainlinkFunction = chainlinkFunctions[_proxyAddress];
        require(chainlinkFunction.owner != address(0), "Function does not exist");
        // Require that the sender includes a deposit equal to or greater than the fee
        console.log("linkToken.address %s, linkAddress %s", address(linkToken), linkAddress);
        console.log("sender %s LINK balance %d", msg.sender, linkToken.balanceOf(msg.sender));
        require(
            linkToken.balanceOf(msg.sender) >= baseFee + chainlinkFunction.fee,
            "You do not have enough LINK to call this function"
        );
        console.log("transferring fee of %d to contract", chainlinkFunction.fee);
        require(
            linkToken.transferFrom(msg.sender, address(this), chainlinkFunction.fee),
            "Failed to collect fees from caller"
        );

        // If the fee pool doesn't exist, this will updated it
        console.log("adding baseFee %d to subscription pool");
        chainlinkFunction.subscriptionPool = chainlinkFunction.subscriptionPool + baseFee;
        console.log("adding baseFee %d to subscription pool");
        console.log("chainlinkFunction * fee: %d", chainlinkFunction.fee * feeManagerCut);
        uint256 functionManagerCut = (chainlinkFunction.fee * feeManagerCut) / 100;
        console.log(
            "adding fee - functionManagerCut %d to lockedProfitPool", chainlinkFunction.fee - functionManagerCut
        );
        chainlinkFunction.lockedProfitPool =
            chainlinkFunction.lockedProfitPool + chainlinkFunction.fee - functionManagerCut;
        console.log("adding functionManagerCut %d to feeManagerProfitPool", functionManagerCut);
        feeManagerProfitPool = feeManagerProfitPool + functionManagerCut;

        // TODO handle caller gas deposit

        // TODO not the actual request ID
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

    // TODO only the proxy contract should be able to call this
    function handleFunctionCallback(bytes32 _requestId, bytes calldata _response, bytes calldata _err) external {
        require(functionResponses[_requestId].caller != address(0), "Attempted callback with unknown request ID");
        functionResponses[_requestId].response = _response;
        functionResponses[_requestId].err = _err;

        FunctionMetadata storage chainlinkFunction = chainlinkFunctions[functionResponses[_requestId].proxyAddress];
        require(chainlinkFunction.owner != address(0), "Function does not exist");
        // Check if the caller of this function is the ProxyContract, can't do this right now becau,
        // Add a new functionReponses entry for this requestId

        // Function manager has already taken its cut, so calculate the amount owed to the function owner
        // by taking the FunctionManager cut from the fee and adding it to the owner profit pool
        uint256 unlockAmount = (chainlinkFunction.fee * (100 - feeManagerCut)) / 100;
        chainlinkFunction.lockedProfitPool -= unlockAmount;
        chainlinkFunction.unlockedProfitPool += unlockAmount;

        console.log("unlockAmount %d", unlockAmount);
        console.log("function caller %s", functionResponses[_requestId].caller);
        emit FunctionCallCompleted({
            proxyAddress: functionResponses[_requestId].proxyAddress,
            owner: chainlinkFunction.owner,
            caller: functionResponses[_requestId].caller,
            callbackFunction: functionResponses[_requestId].callbackFunction,
            requestId: _requestId,
            response: _response,
            err: _err
        });
    }

    // Function that lets you withdraw all of this contracts balance to the FunctionManager owner
    function withdrawContractBalToOwner() external onlyOwner {
        require(msg.sender == owner(), "Only contract owner can withdraw");
        require(linkToken.transferFrom(address(this), owner(), feeManagerProfitPool), "Transfer failed");
        feeManagerProfitPool = 0;
    }

    // Full withdrawl of the function owner profit pool to the function owner
    function withdrawProfitToFuncOwner(address _proxyAddress) external _onlyFunctionOwner(_proxyAddress) {
        FunctionMetadata storage chainlinkFunction = chainlinkFunctions[_proxyAddress];
        require(chainlinkFunction.owner == msg.sender, "Only func owner can withdraw");
        require(
            linkToken.transferFrom(address(this), chainlinkFunction.owner, chainlinkFunction.unlockedProfitPool),
            "Transfer failed"
        );
        chainlinkFunction.unlockedProfitPool = 0;
    }
}
