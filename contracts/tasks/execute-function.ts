import { task } from "hardhat/config";
// import { ethers } from "hardhat";

task("execute-function", "runs a function")
  .addOptionalParam(
    "privateKey",
    "The private key of the account to send tx from",
    process.env.PRIVATE_KEY,
    undefined
  )
  .addOptionalParam(
    "functionsManager",
    "The address of the function manager",
    process.env.FUNCTION_MANAGER_ADDR,
    undefined
  )
  .addParam(
    "functionId",
    "The id of the function to execute",
    undefined,
    undefined,
    false
  )
  .addOptionalParam(
    "callbackGasLimit",
    "The gas limit to use for the transaction",
    "300000", //Max gas that can be used in callback
    undefined
  )
  .setAction(async (taskArgs) => {
    if (!taskArgs.privateKey) {
      throw new Error("--privateKey must be specified");
    }
    if (!taskArgs.functionsManager) {
      throw new Error("--functionManager must be specified");
    }
    if (!taskArgs.functionId) {
      throw new Error("--functionId must be specified");
    }

    const [signer] = await ethers.getSigners();
    const functionsManagerRaw = await ethers.getContractAt(
      "FunctionsManager",
      taskArgs.functionsManager
    );
    const functionsManager = await functionsManagerRaw.connect(signer);

    console.log("Executing function: ", taskArgs.functionId);
    const rawExecute = await functionsManager.executeRequest(
      ethers.utils.formatBytes32String(taskArgs.functionId),
      // taskArgs.functionId,
      taskArgs.callbackGasLimit,
      false //dummy call or not
    );

    const receipt = await rawExecute.wait();
    console.log("Raw receipt: ", receipt);
    console.log("Transaction mined in block " + receipt.blockNumber);
    console.log(
      "Received the following events: ",
      receipt.events
        ?.map((e) => e.event + ": " + JSON.stringify(e.args))
        .join("\n")
    );
  });
