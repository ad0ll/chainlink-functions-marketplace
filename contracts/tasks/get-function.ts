import { task, types } from "hardhat/config";

task("get-function", "gets function response")
  .addOptionalParam(
    "functionsmanager",
    "The address of the function manager",
    undefined,
    types.string
  )
  .addOptionalParam(
    "functionid",
    "The id of the functions to retrieve",
    undefined,
    types.string
  )
  .setAction(async (taskArgs, { ethers }) => {
    if (!taskArgs.functionsmanager) {
      throw new Error("--functionmanager must be specified");
    }
    if (!taskArgs.functionid) {
      throw new Error("--functionid must be specified");
    }

    const [signer] = await ethers.getSigners();
    const functionsManagerRaw = await ethers.getContractAt(
      "FunctionsManager",
      taskArgs.functionsmanager
    );
    const functionsManager = functionsManagerRaw.connect(signer);

    console.log("Getting metadata for functionId: ", taskArgs.functionid);
    const metadata = await functionsManager.getFunction(taskArgs.functionid);

    console.log(`Metadata: ${JSON.stringify(metadata)}`);
  });
