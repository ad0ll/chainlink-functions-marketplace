pragma solidity ^0.8.7;

// AutomationCompatible.sol imports the functions from both ./AutomationBase.sol and
// ./interfaces/AutomationCompatibleInterface.sol
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
// Can't use the below because it doesn't have getSubscription
// import {FunctionsBillingRegistryInterface} from "./functions/interfaces/FunctionsBillingRegistryInterface.sol";
import {FunctionsBillingRegistry} from "./functions/FunctionsBillingRegistry.sol";
import {FunctionsManager} from "./FunctionsManager.sol";
/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

//TODO Need to figure out how to keep each upkeep id funded
contract FunctionsManagerMonitor is AutomationCompatibleInterface {
    /**
     * Public counter variable
     */

    /**
     * Use an interval in seconds and a timestamp to slow execution of Upkeep
     */
    uint256 public constant SIZE = 100000;
    FunctionsManager public functionsManager;
    FunctionsBillingRegistry public functionsBillingRegistry;
    uint256 public threshold = 10 ** 18 * 3; // Refill immediately when falls under N (3 by default) LINK

    mapping(uint64 => bool) public knownSubscriptionIds;
    uint64[SIZE] public functionManagerSubscriptionIds;
    uint256 public functionsManagerSubscriptionIdsIndex = 0;

    constructor(address _functionsManager, address _functionsBillingRegistry) {
        functionsManager = FunctionsManager(_functionsManager);
        functionsBillingRegistry = FunctionsBillingRegistry(_functionsBillingRegistry);
    }

    function addSubscription(uint64 subscriptionId) external {
        require(functionsManagerSubscriptionIdsIndex < SIZE, "SubscriptionKeeper: SubscriptionKeeper is full");
        require(!knownSubscriptionIds[subscriptionId], "Subscription already added");
        (uint96 balance, address ownerAddr,) = functionsBillingRegistry.getSubscription(subscriptionId);
        require(ownerAddr != address(0), "Subscription is not registered with the billing registry");
        knownSubscriptionIds[subscriptionId] = true;
        functionManagerSubscriptionIds[functionsManagerSubscriptionIdsIndex] = subscriptionId;
        functionsManagerSubscriptionIdsIndex = functionsManagerSubscriptionIdsIndex + 1;
    }

    function needsUpkeep(uint64 _subscriptionId) public view returns (bool) {
        (uint96 balance,,) = functionsBillingRegistry.getSubscription(_subscriptionId);
        uint256 fmBalance = functionsManager.getSubscriptionBalance(_subscriptionId);
        return balance < threshold && fmBalance > 0;
    }

    // There will be 1 upkeepId per page of data (need this to be a fixed number for predictability)
    // checkUpkeep will iterate over each page, and if any of the known subscriptionIDs need upkeep, it will return true + a list of the subscriptions to update
    function checkUpkeep(bytes calldata checkData)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */ )
    {
        //(balance, owner, consumers)
        (uint256 lowerBound, uint256 upperBound) = abi.decode(checkData, (uint256, uint256));

        //First get the total number of elems requiring a transfer, so we can build them into an array for performUpkeep
        uint256 counter;
        for (uint256 i = 0; i < upperBound - lowerBound + 1; i++) {
            uint64 subscriptionId = functionManagerSubscriptionIds[lowerBound + i];
            if(needsUpkeep(subscriptionId)) {
                counter++;
            }
        }
        if (counter == 0) {
            return (false, "");
        }
        //Now build the array

        uint64[] memory performData = new uint64[](counter);
        uint256 needsUpkeepIdx = 0;
        for (uint256 i = 0; i < upperBound - lowerBound + 1; i++) {
            uint64 subscriptionId = functionManagerSubscriptionIds[lowerBound + i];
            if(needsUpkeep(subscriptionId)) {
                performData[needsUpkeepIdx] = subscriptionId;
                needsUpkeepIdx++;
            }
        }
        return (true, abi.encode(performData));
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(bytes calldata performData) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        (uint64[] memory subscriptionIds) = abi.decode(performData, (uint64[]));

        for(uint256 i = 0; i < subscriptionIds.length; i++) {
            uint64 subscriptionId = subscriptionIds[i];
            if(needsUpkeep(subscriptionId)) {
                functionsManager.refillSubscription(subscriptionId);
            }
        }
        // We don't use the performData in this example. The performData is generated by the Automation Node's call to your checkUpkeep function
    }
}
