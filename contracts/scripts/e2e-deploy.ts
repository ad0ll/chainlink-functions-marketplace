import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { FunctionsManager } from "../typechain-types";

/*
This script deploys the function manager

To use, pass at least two private keys to the PRIVATE_KEYS environment variable
The first account MUST have MATIC on Mumbai to deploy the function manager contract
The second account MUST have both MATIC and LINK
*/

// Mumbai
const linkAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
const billingRegistryAddress = "0x3c79f56407DCB9dc9b852D139a317246f43750Cc";
const oracleAddress = "0x649a2C205BE7A3d5e99206CEEFF30c794f0E31EC";
const ONE_LINK = BigNumber.from("1000000000000000000");

//Specify this var to not deploy the functions manager
const FUNCTION_MANAGER_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const deployFunctionManager = async () => {
  const FunctionsManager = await ethers.getContractFactory("FunctionsManager");
  const functionsManager = await FunctionsManager.deploy(
    linkAddress,
    billingRegistryAddress,
    oracleAddress,
    ONE_LINK.div(5), // 0.2 LINK
    5 //Fee manager takes 5% of all fees
  );
  await functionsManager.deployed();
  return functionsManager;
};

async function main() {
  let functionsManager: FunctionsManager;
  if (FUNCTION_MANAGER_ADDRESS) {
    functionsManager = await deployFunctionManager();

    console.log(
      `Deployed FunctionsManager contract to ${
        functionsManager.address
      } with account ${functionsManager.owner()}`
    );
  } else {
    functionsManager = await ethers.getContractAt(
      "FunctionsManager",
      FUNCTION_MANAGER_ADDRESS
    );
    console.log(
      "Fetched existing FunctionsManager contract at",
      functionsManager.address
    );
  }
  const [functionsManagerOwner, user1] = await ethers.getSigners();

  console.log("Connecting to functions manager as " + user1.address);
  const externalFuncManagerCaller = await functionsManager.connect(user1);
  console.log("Deploying demo function");
  const demoFuncProxyAddrRet = await externalFuncManagerCaller.registerFunction(
    {
      name: "DemoFunction",
      owner: user1.address,
      desc:
        "This was created by the deploy script at " + new Date().toISOString(),
      imageUrl: "https://i.imgur.com/VE7uGB9.gif",
      fee: ONE_LINK.div(10), // 0.1 LINK
      subId: 0,
      subscriptionPool: 0,
      unlockedProfitPool: 0,
      lockedProfitPool: 0,
    },
    { gasLimit: 20_000_000 }
  );
  const demoFuncReceipt = await demoFuncProxyAddrRet.wait();
  const demoFuncAddrEvent = demoFuncReceipt.events?.find(
    (e) => e.event === "FunctionRegistered"
  );
  if (!demoFuncAddrEvent) throw new Error("FunctionRegistered event not found");
  if (!demoFuncAddrEvent?.args?.addr)
    throw new Error("FunctionRegistered event did not contain a proxy address");
  const {
    addr: demoFuncAddr,
    name: demoFuncName,
    owner: demoFuncOwner,
    desc: demoFuncDesc,
    imageUrl: demoFuncImageUrl,
    fee: demoFuncFee,
    subId: demoFuncSubId,
    subscriptionPool: demoFuncSubscriptionPool,
    unlockedProfitPool: demoFuncUnlockedProfitPool,
    lockedProfitPool: demoFuncLockedProfitPool,
  } = demoFuncAddrEvent.args;
  console.log(
    "Registered function with proxy address",
    demoFuncAddr,
    " and subsciption id",
    demoFuncSubId
  );
  console.log("Raw FunctionRegistered event", demoFuncAddrEvent?.args);

  // getContractAt is a hardhat helper and not an ethers function, which allows us to pass the name to get an artifact instead of passing the ABI: https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-ethers#helpers
  const subscripionContract = await ethers.getContractAt(
    "FunctionsBillingRegistry",
    billingRegistryAddress
  );
  const subscription = await subscripionContract.getSubscription(demoFuncSubId);
  console.log("Subscription", subscription);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
