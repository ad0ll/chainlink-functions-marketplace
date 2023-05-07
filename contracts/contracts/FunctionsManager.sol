// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import { FunctionsClient } from './functions/FunctionsClient.sol';
import { Functions } from './functions/Functions.sol';
import { FunctionsBillingRegistry } from './functions/FunctionsBillingRegistry.sol';
import { FunctionsOracleInterface } from './functions/interfaces/FunctionsOracleInterface.sol';
import { LinkTokenInterface } from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import { EnumerableMap } from "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

contract FunctionsManager {
    using EnumerableMap for EnumerableMap.AddressToUintMap;

    EnumerableMap.AddressToUintMap private registeredFunctions;

    LinkTokenInterface private LINK;
    FunctionsBillingRegistry private BILLING_REGISTRY;
    FunctionsOracleInterface private ORACLE;

    // Functions metadata
    struct FunctionsMetadata {
        uint64 totalFees;
        uint64 subId;
        string functionName;
        string desc;
        string imageUrl;
        // TODO: Need to store request during register?
        // Functions.Request request;
    }

    // Event emitted when a Function is registered
    event FunctionRegistered(
        address indexed proxyAddress, 
        address indexed owner, 
        FunctionsMetadata metadata
    );

    // Initialize with the Chainlink proxies that are commonly interacted with
    constructor(address link, address billingRegistryProxy, address oracleProxy){
        LINK = LinkTokenInterface(link);
        BILLING_REGISTRY = FunctionsBillingRegistry(billingRegistryProxy);
        ORACLE = FunctionsOracleInterface(oracleProxy);
    }

    // FunctionRegistered event - Will have metadata from register function params
    // FunctionCalled event (Probably not used by the webapp)
    // FunctionError event
    // FunctionSuccess event
    function registerFunction(FunctionsMetadata calldata metadata) public returns (address) {
        // 1. NEW create or address and check
        // 2. Fund w/ initial deposit if NEW
        // 3. Add self (FunctionManager) to authorized users
        // 4?. Check owner is registered with OracleProxy (i.e is registered in function beta)
        // 4. (Somewhere) Deploy proxy contact, get address
        // ??? Ensure interface is correct, probably not important ???
        // 5. Add function to FunctionsManager
        uint64 subId = createSubscription();

        address proxy = deployFunctionsProxy(subId);

        // Emit FunctionRegistered event
        emit FunctionRegistered(address(proxy), msg.sender, metadata);
        
        return address(proxy);
    }

    function deployFunctionsProxy(uint64 subId) internal returns (address) {
        FunctionsClient proxy = new FunctionsClient(address(ORACLE));
        return address(proxy);
    }

    function createSubscription() internal returns (uint64) {
        uint64 subId = BILLING_REGISTRY.createSubscription();
        // TODO: Fund subscription link transferAndCall
        return subId;
    }

    function executeFunction() public{

    }
    function executeFunctionCallback() public{
        // Emit metrics and return response to the person executing the function through the FuncionsManager
        // We need to make sure that the downstream contract can't conceal execution results since we need it to record metrics.
    }

}
