import { task, types } from "hardhat/config";

task("arbitrary-approve", "approve arbitrary address to transfer LINK")
  .addParam(
    "linktokenaddr",
    "The address of LINK token",
    process.env["FUNCTIONS_MANAGER_ADDR"],
    types.string
  )
  .setAction(async (taskArgs, { ethers }) => {
    if (!taskArgs.linktokenaddr) {
      throw new Error("--functionmanager must be specified");
    }
    const linkToken= await ethers.getContractAt(
      "LinkTokenInterface",
      
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
