// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract FunctionManagerDraft {


    constructor(){

    }

// FunctionRegistered event - Will have metadata from register function params
// FunctionCalled event (Probably not used by the webapp)
// FunctionError event
// FunctionSuccess event
    function registerFunction(subscriptionId) public {
         // 1. NEW create or address and check
         // 2. Fund w/ initial deposit if NEW
         // 3. Add self (FunctionManager) to authorized users
         // 4?. Check owner is registered with OracleProxy (i.e is registered in function beta)
         // 4. (Somewhere) Deploy proxy contact, get address
         // ??? Ensure interface is correct, probably not important ???
         // 5. Add function to FunctionsManager
    }

    function executeFunction() public{

    }
    function executeFunctionCallback() public{
        // Emit metrics and return response to the person executing the function through the FuncionsManager
        // We need to make sure that the downstream contract can't conceal execution results since we need it to record metrics.
    }

}