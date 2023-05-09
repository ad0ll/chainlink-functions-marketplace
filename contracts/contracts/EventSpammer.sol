pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EventSpammer is Ownable {
    // Functions metadata
    // Functions metadata
    struct FunctionMetadata {
        uint256 fee;
        address owner;
        uint64 subId;
        string name;
        string desc;
        string imageUrl;
        // Subscription fields
        uint256 subscriptionPool; // Reserved base fees collected, can't be withdrawn
        uint256 unlockedProfitPool; // Profits from completed functions, can be withdrawn on demand
        uint256 lockedProfitPool; // Profits from initialized calls that haven't had their callback completed yet
    }

    // TODO: Need to store request during register?
    // Functions.Request request;

    address[] public registeredFunctions;
    // Event emitted when a Function is registered

    event FunctionRegistered(address indexed proxyAddress, address indexed owner, FunctionMetadata metadata);

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

    function emitRegisterFunction(
        address _proxyAddress,
        address _owner,
        string calldata _name,
        string calldata _desc,
        string calldata _imageUrl,
        uint64 _subId,
        uint256 _fee
    ) external onlyOwner {
        FunctionMetadata memory metadata = FunctionMetadata({
            owner: _owner,
            fee: _fee,
            subId: _subId,
            name: _name,
            desc: _desc,
            imageUrl: _imageUrl,
            subscriptionPool: 0,
            unlockedProfitPool: 0,
            lockedProfitPool: 0
        });
        emit FunctionRegistered(_proxyAddress, msg.sender, metadata);
    }

    function emitCallFunction(
        address _proxyAddress,
        bytes32 _requestId,
        bytes32 _callbackFunction,
        address _owner,
        address _caller,
        uint256 _fee
    ) external {
        emit FunctionCalled({
            proxyAddress: _proxyAddress,
            caller: _caller,
            requestId: _requestId,
            owner: _owner,
            callbackFunction: _callbackFunction,
            baseFee: 10 ** 18 / 5,
            fee: _fee
        });
    }

    function emitCallbackWithData(
        address _proxyAddress,
        address _owner,
        address _caller,
        bytes32 _requestId,
        bytes32 _callbackFunction,
        bytes memory _response,
        bytes memory _err
    ) external {
        emit FunctionCallCompleted({
            proxyAddress: _proxyAddress,
            caller: _caller,
            requestId: _requestId,
            owner: _owner,
            callbackFunction: _callbackFunction,
            response: _response,
            err: _err
        });
    }
}
