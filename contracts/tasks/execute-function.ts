import { task } from "hardhat/config";
import { ArgumentType } from "hardhat/types";
import { ethers } from "hardhat";

task("myTask", "A task that takes an argument")
  .addParam(
    "privateKey",
    "The private key of the account to send tx from",
    process.env.PRIVATE_KEY,
    undefined,
    false
  )
  .addParam(
    "functionManager",
    "The address of the function manager",
    process.env.FUNCTION_MANAGER_ADDRESS,
    undefined,
    false
  )
  .addParam(
    "functionId",
    "The id of the function to execute",
    undefined,
    undefined,
    false
  )
  .addParam(
    "gasLimit",
    "The gas limit to use for the transaction",
    300_000,
    undefined,
    true
  ) //Max gas that can be used in callback
  .setAction(async (taskArgs) => {
    if (!taskArgs.privateKey) {
      throw new Error("--privateKey must be specified");
    }
    if (!taskArgs.functionManager) {
      throw new Error("--functionManager must be specified");
    }
    if (!taskArgs.functionId) {
      throw new Error("--functionId must be specified");
    }

    const FUNCTION_MANAGER_ADDRESS = process.env.FUNCTION_MANAGER_ADDRESS;
    if (!FUNCTION_MANAGER_ADDRESS) {
      throw new Error("FUNCTION_MANAGER_ADDRESS must be specified");
    }

    const functionsManager = await ethers.getContractAt(
      "FunctionsManager",
      FUNCTION_MANAGER_ADDRESS,
      taskArgs.privateKey
    );

    const rawExecute = await functionsManager.executeRequest(
      taskArgs.functionId,
      taskArgs.gasLimit,
      false
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
