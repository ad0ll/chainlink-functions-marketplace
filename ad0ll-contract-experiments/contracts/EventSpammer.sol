pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EventSpammer is Ownable {
    // Functions metadata
    struct FunctionsMetadata {
        uint256 fee;
        uint64 subId;
        string functionName;
        string desc;
        string imageUrl;
    }
    // TODO: Need to store request during register?
    // Functions.Request request;

    address[] public registeredFunctions;
    // Event emitted when a Function is registered
    event FunctionRegistered(address indexed proxyAddress, address indexed owner, FunctionsMetadata metadata);

    event FunctionCalled(
        address indexed proxyAddress,
        address indexed caller,
        bytes32 indexed requestId,
        bytes32 callbackFunction,
        uint256 deposit
    );

    event CallbackCompletedWithData(
        address indexed proxyAddress,
        bytes32 indexed requestId,
        bytes32 indexed callbackFunction,
        bytes response,
        bytes err
    );

    function emitRegisterFunction(
        address _proxyAddress,
        string calldata _functionName,
        string calldata _desc,
        string calldata _imageUrl,
        uint64 _subId,
        uint256 _fee
    ) external onlyOwner {
        FunctionsMetadata memory metadata =
            FunctionsMetadata({fee: _fee, subId: _subId, functionName: _functionName, desc: _desc, imageUrl: _imageUrl});
        emit FunctionRegistered(_proxyAddress, msg.sender, metadata);
    }

    function emitCallFunction(address _proxyAddress, bytes32 _requestId, bytes32 _callbackFunction, uint256 _deposit)
        external
    {
        emit FunctionCalled(_proxyAddress, msg.sender, _requestId, _callbackFunction, _deposit);
    }

    function emitCallbackWithData(
        address _proxyAddress,
        bytes32 _requestId,
        bytes32 _callbackFunction,
        bytes memory _response,
        bytes memory _err
    ) external {
        emit CallbackCompletedWithData(_proxyAddress, _requestId, _callbackFunction, _response, _err);
    }
}
