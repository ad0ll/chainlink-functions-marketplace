pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

// import "@chainlink/contracts/src/v0.4/LinkToken.sol";

// import "forge-std/console.sol";
import "hardhat/console.sol";
// import "interfaces/FeeManagerInterface.sol";

contract FeeManager is Ownable {
    // Numeric field representing the contract holder profit pool
    uint256 public feeManagerProfitPool;
    uint256 public baseFee = 2000000000000000000; //TODO can we get this from the chainlink contract?
    uint32 public feeManagerCut;
    address public linkAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    LinkTokenInterface private linkToken = LinkTokenInterface(linkAddress);

    // Struct called FeePools with 2 numeric fields, subscription pool and owner profit pool
    struct FeePool {
        bool exists;
        uint256 subscriptionPool;
        uint256 ownerProfitPool;
        uint256 lockedProfitPool;
    }

    struct ChainlinkFunction {
        address owner;
        address proxyAddress;
        bytes32 functionName;
        bytes32 callbackFunction;
        uint256 fee;
    }

    struct FunctionResponse {
        bytes response;
        bytes err;
    }

    struct FunctionOwner {
        bytes32 name;
    }

    // Permanent storage of function responses
    mapping(bytes32 => FunctionResponse) functionResponses;
    // Mapping of FunctionProxy contract addresses to ChainlinkFunction
    mapping(address => ChainlinkFunction) chainlinkFunctions;
    // Mapping of FunctionProxy contract addresses to FeePool
    mapping(address => FeePool) feePools;

    //TBD, idea originally was to have a mapping of requestId to unused gas
    mapping(bytes32 => uint256) public gasRefunds;

    event FunctionRegistered(
        address indexed proxyAddress, address indexed owner, bytes32 functionName, bytes32 callbackFunction, uint256 fee
    );

    event FunctionCalled(
        address indexed proxyAddress,
        address indexed caller,
        address indexed owner,
        bytes32 requestId,
        bytes32 functionName,
        bytes32 callbackFunction
    );

    event CallbackCompletedWithData(
        address indexed proxyAddress,
        address indexed owner,
        bytes32 indexed requestId,
        bytes32 functionName,
        bytes32 callbackFunction,
        bytes response,
        bytes err
    );

    event CallbackCompletedNoData(
        address indexed _proxyAddress, address indexed _owner, bytes32 indexed _requestId, bool error
    );

    constructor(address _linkTokenAddress, uint256 _baseFee, uint32 _feeManagerCut) {
        linkAddress = _linkTokenAddress;
        linkToken = LinkTokenInterface(linkAddress);
        baseFee = _baseFee;
        feeManagerCut = _feeManagerCut;
    }

    modifier _onlyFunctionOwner(address _proxyAddress) {
        // Require that the person initiating the transaction owns the proxy contract at _proxyAddress
        require(msg.sender == chainlinkFunctions[_proxyAddress].owner, "Not the function owner");
        _;
    }

    // Function that lets you change the baseFee
    function setBaseFee(uint256 _baseFee) external onlyOwner {
        baseFee = _baseFee;
    }

    // Function that lets you change the feeManagerCut
    function setFeeManagerCut(uint32 _feeManagerCut) external onlyOwner {
        feeManagerCut = _feeManagerCut;
    }

    function getFunction(address _proxyAddress) external view returns (ChainlinkFunction memory) {
        console.log("getFunction");
        return chainlinkFunctions[_proxyAddress];
    }

    function getFunctionResponse(bytes32 _requestId) external view returns (FunctionResponse memory) {
        console.log("getFunctionResponse");
        return functionResponses[_requestId];
    }

    function getFeePool(address _proxyAddress) external view returns (FeePool memory) {
        console.log("getFeePool");
        return feePools[_proxyAddress];
    }

    //The _proxyAddress is the address functions proxy contract that we help the owner deploy
    function registerFunction(address _proxyAddress, bytes32 _functionName, bytes32 _callbackFunction, uint256 _fee)
        external
    {
        console.log("registering function");
        console.logBytes32(_functionName);
        // Require that the function doesn't already exist
        // Require that the person initiating the transaction owns the proxy contract at _proxyAddress
        // Create a new ChainlinkFunction with the given parameters

        //TODO Assert the person calling this is the owner of proxy contract
        //Require fee is greater than 0
        require(_fee >= 0, "Fee must be greater than 0");
        //Require function doesn't already exist
        ChainlinkFunction memory existingFunction = chainlinkFunctions[_proxyAddress];
        console.log("Existing function functionName");
        console.logBytes32(existingFunction.functionName);
        console.log("Existing function callbackFunction");
        console.logBytes32(existingFunction.callbackFunction);
        require(chainlinkFunctions[_proxyAddress].functionName == 0, "Function already exists");

        // Add the ChainlinkFunction to chainlinkFunctions
        chainlinkFunctions[_proxyAddress] =
            ChainlinkFunction(msg.sender, _proxyAddress, _functionName, _callbackFunction, _fee);
        // Add the FunctionProxy contract address to feePools so we can start collection fees
        feePools[_proxyAddress] = FeePool({exists: true, subscriptionPool: 0, ownerProfitPool: 0, lockedProfitPool: 0});
        emit FunctionRegistered(_proxyAddress, msg.sender, _functionName, _callbackFunction, _fee);
    }

    function callFunction(address _proxyAddress, bytes32 _callbackFunction) external payable {
        // Get the function from chainlinkFunctions, require it exists
        ChainlinkFunction memory chainlinkFunction = chainlinkFunctions[_proxyAddress];
        require(chainlinkFunction.functionName != 0, "Function does not exist");
        uint256 linkBalance = linkToken.balanceOf(msg.sender);

        // Require that the sender includes a deposit equal to or greater than the fee
        require(linkBalance >= baseFee + chainlinkFunction.fee, "Fee not met");

        console.log(tx.gasprice);
        console.log(tx.gasprice * 300000);

        FeePool storage feePool = feePools[_proxyAddress];
        require(feePool.exists, "Fee pool does not exist");
        feePool.subscriptionPool += baseFee;
        feePool.ownerProfitPool += (chainlinkFunction.fee * feeManagerCut) / 100;
        feePool.lockedProfitPool += (chainlinkFunction.fee * (100 - feeManagerCut)) / 100;

        // TODO handle caller gas deposit

        require(linkToken.transfer(address(this), chainlinkFunction.fee));

        //TODO not the actual request ID
        bytes32 _requestId =
            keccak256(abi.encodePacked(_proxyAddress, chainlinkFunction.functionName, msg.sender, block.timestamp));

        emit FunctionCalled(
            _proxyAddress,
            msg.sender,
            chainlinkFunction.owner,
            _requestId,
            chainlinkFunction.functionName,
            _callbackFunction
        );
    }

    function handleFunctionCallback(
        address _proxyAddress,
        bytes32 requestId,
        bytes calldata response,
        bytes calldata err
    ) external {
        ChainlinkFunction memory chainlinkFunction = chainlinkFunctions[_proxyAddress];
        // Add a new functionReponses entry for this requestId
        functionResponses[requestId] = FunctionResponse({response: response, err: err});

        uint256 unlockFees = (chainlinkFunction.fee * (100 - feeManagerCut)) / 100;
        feePools[_proxyAddress].lockedProfitPool -= unlockFees;
        feePools[_proxyAddress].ownerProfitPool += unlockFees;

        emit CallbackCompletedWithData(
            _proxyAddress,
            chainlinkFunction.owner,
            requestId,
            chainlinkFunction.functionName,
            chainlinkFunction.callbackFunction,
            response,
            err
        );
    }

    // Function that lets you withdraw all of this contracts balance to the FunctionManager owner
    function withdrawContractBalToOwner() external onlyOwner {
        require(msg.sender == owner(), "Only contract owner can withdraw");
        require(linkToken.transfer(owner(), feeManagerProfitPool), "Transfer failed");
        feeManagerProfitPool = 0;
    }

    // Single withdrawal
    function withdrawProfitToFuncOwner(address _proxyAddress) external _onlyFunctionOwner(_proxyAddress) {
        ChainlinkFunction memory chainlinkFunction = chainlinkFunctions[_proxyAddress];
        require(chainlinkFunction.owner == msg.sender, "Only func owner can withdraw");
        FeePool storage feePool = feePools[_proxyAddress];
        require(feePool.exists, "No fee pool exists for this function");
        require(linkToken.transfer(chainlinkFunction.owner, feePool.ownerProfitPool), "Transfer failed");
        feePool.ownerProfitPool = 0;
    }
}
