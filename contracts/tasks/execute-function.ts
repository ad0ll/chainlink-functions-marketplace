import { task, types } from "hardhat/config";

task("execute-function", "runs a function")
  .addOptionalParam(
    "functionsmanager",
    "The address of the function manager",
    process.env.FUNCTION_MANAGER_ADDR,
    types.string
  )
  .addParam(
    "functionid",
    "The id of the function to execute",
    undefined,
    types.string
  )
  .addParam("args", "The args for the function", undefined, types.string)
  .addOptionalParam(
    "callbackGasLimit",
    "The gas limit to use for the transaction",
    "300000", //Max gas that can be used in callback
    types.string
  )
  .addOptionalParam(
    "gaslimit",
    "Maximum amount of gas that can be used to call fulfillRequest in the client contract",
    2000000,
    types.int
  )
  .setAction(async (taskArgs, { ethers }) => {
    if (!taskArgs.functionsmanager) {
      throw new Error("--functionmanager must be specified");
    }
    if (!taskArgs.functionid) {
      throw new Error("--functionid must be specified");
    }
    if (taskArgs.gaslimit <= 0 || taskArgs.gaslimit > 20000000) {
      throw new Error(
        "--gaslimit must be greater than 0 and less than or equal to 20,000,000"
      );
    }

    const [signer] = await ethers.getSigners();
    const functionsManagerRaw = await ethers.getContractAt(
      "FunctionsManager",
      taskArgs.functionsmanager
    );
    const functionsManager = functionsManagerRaw.connect(signer);

    console.log("Executing function: ", taskArgs.functionid);
    const args = taskArgs.args ? taskArgs.args.split(",") : [];
    // const rawExecute = await functionsManager.executeRequest(
    //   taskArgs.functionid,
    //   args,
    //   taskArgs.callbackGasLimit,
    //   {
    //     gasLimit: taskArgs.gaslimit,
    //   }
    // );
    console.log("Approving token transfer");
    const rawExecuteApprove = await functionsManager.approveTokenTransfer({
      gasLimit: taskArgs.gaslimit,
    });
    console.log("Waiting for confirmations...");
    const receipt = await rawExecuteApprove.wait(3);
    console.log("Transaction mined in block " + receipt.blockNumber);
    console.log(
      "Received the following events: ",
      receipt.events
        ?.map((e) => e.event + ": " + JSON.stringify(e.args))
        .join("\n")
    );
    console.log(receipt);
    console.log("Getting balance");
    const rawExecute = await functionsManager.dumpBalanceOf({
      gasLimit: taskArgs.gaslimit,
    });

    // const receipt = await rawExecute.wait(1);
    // console.log("Transaction mined in block " + receipt.blockNumber);
    // console.log(
    //   "Received the following events: ",
    //   receipt.events
    //     ?.map((e) => e.event + ": " + JSON.stringify(e.args))
    //     .join("\n")
    // );
    // if (receipt.events && receipt.events[3] && receipt.events[3].args) {
    //   const requestId = receipt.events[3].args["requestId"].toString();
    //   console.log(`Executed function. Request Id: ${requestId}`);
    //   const response = await functionsManager.getFunctionResponse(requestId);
    //   console.log(JSON.stringify(response));
    // }
  });
