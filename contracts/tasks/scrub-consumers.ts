import { task } from "hardhat/config";
// import { ethers } from "hardhat";

// NOTE: This contains code copied or adapted from CLL's hardhat repo: tasks/Functions-billing/create.js
const {
  VERIFICATION_BLOCK_CONFIRMATIONS,
  networkConfig,
} = require("./../../contracts/network-config.js");
task("scrub-consumers", "scrubs consumers from a subscriptiony")
  .addOptionalParam(
    "testNetwork",
    "The network to use, defaulting to polygonMumbai",
    "polygonMumbai",
    undefined
  )
  .addParam(
    "privatekey",
    "some authorized consumer of the subscription",
    process.env.PRIVATE_KEY
  )
  .addParam("subscriptionid", "the subscription to add the user to", undefined)
  .setAction(async (taskArgs, { ethers }) => {
    if (taskArgs.testNetwork === "hardhat") {
      throw Error(
        "This command cannot be used on a local hardhat chain, pass --network with polygonMumbai or sepolia"
      );
    }

    console.log(
      "Getting the billing registry contract at",
      networkConfig[taskArgs.testNetwork]["functionsBillingRegistryProxy"]
    );
    const RegistryFactory = await ethers.getContractFactory(
      "FunctionsBillingRegistry"
    );
    const registry = await RegistryFactory.attach(
      networkConfig[taskArgs.testNetwork]["functionsBillingRegistryProxy"]
    );

    const subscriptionId = parseInt(taskArgs.subscriptionid);

    const sub = await registry.getSubscription(subscriptionId);
    console.log("sub", sub);
    for (let i = 0; i < sub.consumers.length; i++) {
      console.log("removing", sub.consumers[i]);
      const remTx = await registry.removeConsumer(
        subscriptionId,
        sub.consumers[i]
      );

      console.log(
        `Waiting ${VERIFICATION_BLOCK_CONFIRMATIONS} blocks for transaction ${remTx.hash} to be confirmed...`
      );
      await remTx.wait(VERIFICATION_BLOCK_CONFIRMATIONS);
    }
  });
