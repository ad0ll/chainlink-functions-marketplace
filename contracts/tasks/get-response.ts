import { task, types } from "hardhat/config";

task("get-response", "gets function response")
  .addOptionalParam(
    "functionsmanager",
    "The address of the function manager",
    process.env.FUNCTIONS_MANAGER_ADDR,
    types.string
  )
  .addParam(
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

    //Code from here to next comment is from hardhat starter kit
const getDecodedResultLog = (config, successResult) => {
  let resultLog = "";
  if (config.expectedReturnType && config.expectedReturnType !== "Buffer") {
    let decodedOutput;
    switch (config.expectedReturnType) {
      case "uint256":
        decodedOutput = BigInt("0x" + successResult.slice(2).slice(-64));
        break;
      case "int256":
        decodedOutput = signedInt256toBigInt(
          "0x" + successResult.slice(2).slice(-64)
        );
        break;
      case "string":
        decodedOutput = Buffer.from(successResult.slice(2), "hex").toString();
        break;
      default:
        const end = config.expectedReturnType;
        throw new Error(`unused expectedReturnType ${end}`);
    }
    const decodedOutputLog = `Decoded as a ${config.expectedReturnType}: ${decodedOutput}`;
    resultLog += `${decodedOutputLog}\n`;
  }
  return resultLog;
};
exports.getDecodedResultLog = getDecodedResultLog;
const signedInt256toBigInt = (hex) => {
  const binary = BigInt(hex).toString(2).padStart(256, "0");
  // if the first bit is 0, number is positive
  if (binary[0] === "0") {
    return BigInt(hex);
  }
  return -(BigInt(2) ** BigInt(255)) + BigInt(`0b${binary.slice(1)}`);
};

    //Done copying code here

    console.log("response: ", Buffer.from(response.response).toString("utf-8"));
    console.log("err: ", Buffer.from(response.err).toString());

    // console.log(`Response: ${JSON.stringify(response)}`);
  });
