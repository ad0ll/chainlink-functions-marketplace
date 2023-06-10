import { task, types } from "hardhat/config";

task("refill-subscription", "moves locked to subscription")
  .addOptionalParam(
    "functionsmanager",
    "The address of the function manager",
    process.env["FUNCTIONS_MANAGER_ADDR"],
    types.string
  )
  .addOptionalParam(
    "subid",
    "The id of the subscription to refill",
    process.env["FUNCTIONS_SUBSCRIPTION_ID"],
    types.string
  )
  .setAction(async (taskArgs, { ethers }) => {
    if (!taskArgs.functionsmanager) {
      throw new Error("--functionmanager must be specified");
    }
    if (!taskArgs.subId) {
      throw new Error("--subId must be specified");
    }

    const [signer] = await ethers.getSigners();
    const functionsManagerRaw = await ethers.getContractAt(
      "FunctionsManager",
      taskArgs.functionsmanager
    );
    const functionsManager = functionsManagerRaw.connect(signer);

    console.log("Refilling subId: ", taskArgs.subId);
    const metadata = await functionsManager.refillSubscription(taskArgs.subId);

    console.log(`Metadata: ${JSON.stringify(metadata)}`);
  });
