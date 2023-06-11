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
    const metadata = await functionsManager.getFunctionMetadata(
      taskArgs.functionid
    );

    console.log(metadata.expectedReturnType);
    console.log(`Metadata: `, metadata);

    console.log(
      "Getting execute metadata for functionId: ",
      taskArgs.functionid
    );
    const execMetadata = await functionsManager.getFunctionExecuteMetadata(
      taskArgs.functionid
    );
    console.log(`Execute Metadata: `, execMetadata);

    console.log(
      "Getting function request for  functionId: ",
      taskArgs.functionid
    );
    const req = await functionsManager.getFunctionRequest(taskArgs.functionid);
    console.log(`Functions.Request: `, req);
  });
