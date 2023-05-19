import { task, types } from "hardhat/config";

task("get-response", "gets function response")
  .addOptionalParam(
    "functionsmanager",
    "The address of the function manager",
    undefined,
    types.string
  )
  .addOptionalParam(
    "requestid",
    "The id of the request to return the response for",
    undefined,
    types.string
  )
  .setAction(async (taskArgs, { ethers }) => {
    if (!taskArgs.functionsmanager) {
      throw new Error("--functionmanager must be specified");
    }
    if (!taskArgs.requestid) {
      throw new Error("--requestid must be specified");
    }

    const [signer] = await ethers.getSigners();
    const functionsManagerRaw = await ethers.getContractAt(
      "FunctionsManager",
      taskArgs.functionsmanager
    );
    const functionsManager = functionsManagerRaw.connect(signer);

    console.log("Getting response for requestId: ", taskArgs.requestid);
    const response = await functionsManager.getFunctionResponse(
      taskArgs.requestid
    );

    console.log(`Response: ${JSON.stringify(response)}`);
  });
