import { task, types } from "hardhat/config";

const enumToString = (num: number) => {
  switch (num) {
    case 0:
      return "buffer";
    case 1:
      return "uint256";
    case 2:
      return "int256";
    case 3:
      return "string";
    default:
      throw new Error("Unknown buffer type", num);
  }
};
const signedInt256toBigInt = (hex) => {
  const binary = BigInt(hex).toString(2).padStart(256, "0");
  // if the first bit is 0, number is positive
  if (binary[0] === "0") {
    return BigInt(hex);
  }
  return -(BigInt(2) ** BigInt(255)) + BigInt(`0b${binary.slice(1)}`);
};

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

    const functionMetadata = await functionsManager.getFunctionMetadata(
      response.functionId
    );

    console.log(
      "Return type of function is: ",
      functionMetadata.expectedReturnType
    );

    if (response.err !== "0x") {
      console.log(
        "Error: ",
        Buffer.from(response.err.slice(2), "hex").toString()
      );
      return;
    }
    let decodedOutput;
    switch (functionMetadata.expectedReturnType) {
      case 0: //Buffer
        console.log("Received buffer input, attempting to decode to string");
        decodedOutput = Buffer.from(
          response.response.slice(2),
          "hex"
        ).toString();
        break;
      case 1: //uint256
        decodedOutput = BigInt("0x" + response.response.slice(2).slice(-64));
        break;
      case 2: //int256
        decodedOutput = signedInt256toBigInt(
          "0x" + response.response.slice(2).slice(-64)
        );
        break;
      case 3: //string
      default:
        decodedOutput = Buffer.from(
          response.response.slice(2),
          "hex"
        ).toString();
    }
    const decodedOutputLog = `Decoded as a ${enumToString(
      functionMetadata.expectedReturnType
    )}: ${decodedOutput}`;
    console.log(decodedOutputLog);
  });
