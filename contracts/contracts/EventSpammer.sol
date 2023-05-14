pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import {Functions} from "./functions/Functions.sol";

contract EventSpammer is Ownable {
    using Functions for Functions.Request;
    // Functions metadata

    struct FunctionMetadata {
        uint256 fee;
        address owner;
        bytes32 category;
        uint64 subId;
        string name;
        string desc;
        string imageUrl;
        string[] expectedArgs;
        Functions.Request request;
        // Subscription fields
        uint256 subscriptionPool; // Reserved base fees collected, can't be withdrawn
        uint256 unlockedProfitPool; // Profits from completed functions, can be withdrawn on demand
        uint256 lockedProfitPool; // Profits from initialized calls that haven't had their callback completed yet
    }

    uint256 baseFee = 10 ** 18 / 10; // 0.1 LINK

    event FunctionRegistered(bytes32 indexed functionId, address indexed owner, FunctionMetadata metadata);

    mapping(address => bool) public authorizedCallers;

    event FunctionCalled(
        bytes32 indexed functionId,
        bytes32 indexed requestId,
        address indexed caller,
        address owner,
        bytes32 callbackFunction,
        uint256 gasDeposit,
        uint256 baseFee,
        uint256 fee
    );

    event FunctionCallCompleted(
        bytes32 indexed functionId,
        bytes32 indexed requestId,
        address indexed caller,
        address owner,
        bytes32 callbackFunction,
        uint256 usedGas,
        bytes response,
        bytes err
    );

    constructor(address[] memory _authorizedCallers) Ownable() {
        for (uint256 i = 0; i < _authorizedCallers.length; i++) {
            authorizedCallers[_authorizedCallers[i]] = true;
        }
        authorizedCallers[msg.sender] = true;
    }

    modifier onlyAuthorized() {
        require(authorizedCallers[msg.sender], "Not authorized");
        _;
    }

    function emitRegisterFunction(
        bytes32 _functionId,
        address _owner,
        string calldata _name,
        string calldata _desc,
        string calldata _imageUrl,
        string[] memory _expectedArgs,
        bytes32 _category,
        uint64 _subId,
        uint256 _fee,
        Functions.Location _codeLocation,
        string calldata _source
    ) external onlyAuthorized {
        FunctionMetadata memory metadata;

        metadata.owner = _owner;
        metadata.fee = _fee;
        metadata.subId = _subId;
        metadata.name = _name;
        metadata.desc = _desc;
        metadata.imageUrl = _imageUrl;
        metadata.expectedArgs = _expectedArgs;
        metadata.category = _category;
        metadata.subscriptionPool = 0;
        metadata.unlockedProfitPool = 0;
        metadata.lockedProfitPool = 0;

        Functions.Request memory request;
        request.initializeRequest(_codeLocation, Functions.CodeLanguage.JavaScript, _source);
        metadata.request = request;
        emit FunctionRegistered(_functionId, msg.sender, metadata);
    }

    function emitCallFunction(
        bytes32 _functionId,
        bytes32 _requestId,
        address _caller,
        address _owner,
        bytes32 _callbackFunction,
        uint256 _gasDeposit,
        uint256 _fee
    ) external onlyAuthorized {
        emit FunctionCalled({
            functionId: _functionId,
            caller: _caller,
            requestId: _requestId,
            owner: _owner,
            callbackFunction: _callbackFunction,
            gasDeposit: _gasDeposit,
            baseFee: baseFee,
            fee: _fee
        });
    }

    function emitCallbackWithData(
        bytes32 _functionId,
        address _owner,
        address _caller,
        bytes32 _requestId,
        bytes32 _callbackFunction,
        uint256 _usedGas,
        bytes memory _response,
        bytes memory _err
    ) external onlyAuthorized {
        emit FunctionCallCompleted({
            functionId: _functionId,
            caller: _caller,
            requestId: _requestId,
            owner: _owner,
            callbackFunction: _callbackFunction,
            usedGas: _usedGas,
            response: _response,
            err: _err
        });
    }

    function addAuthorizedCaller(address _caller) external onlyOwner {
        authorizedCallers[_caller] = true;
    }
}
