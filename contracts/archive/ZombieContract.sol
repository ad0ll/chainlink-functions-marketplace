pragma solidity ^0.8.17;


interface GenericCallbackDemo {
    function registerCallbackFunction(string calldata callbackFunction, function (bytes32, bytes memory, bytes memory) external callback) external;
}
contract ZombieContract {
    
    GenericCallbackDemo generic;

    constructor(address _generic){
        generic = GenericCallbackDemo(_generic);
    }
    function myCallback(bytes32 _requestId, bytes memory _response, bytes memory _data) external {
        console.log("RECEIVED CALLBACK");
    }
    function registerCallback() public {
        generic.registerCallbackFunction("callback", myCallback);
    }

}