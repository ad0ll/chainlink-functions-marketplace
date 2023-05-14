// This script is used to generate a bunch of noise for the frontend to consume

import { BigNumber } from "ethers";
import { formatBytes32String, keccak256 } from "ethers/lib/utils";
import { ethers } from "hardhat";
import crypto from "crypto";
import randomWords from "random-words";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { start } from "repl";
import { EventSpammer } from "../typechain-types";

const ONE_LINK = BigNumber.from(10).pow(18);
// let EVENT_SPAMMER_ADDR = process.env.EVENT_SPAMMER_ADDR;
let EVENT_SPAMMER_ADDR = "0x0bdcF222aB9300b58fB13352401cb5894426dF17";
async function deployEventSpammer(deployer: SignerWithAddress) {
  console.log("Deploying contracts with the account:", deployer.address);
  const EventSpammer = await ethers.getContractFactory("EventSpammer");
  const eventSpammer = await EventSpammer.deploy();
  console.log("EventSpammer address:", eventSpammer.address);
  EVENT_SPAMMER_ADDR = eventSpammer.address;
  return { eventSpammer };
}

async function resolveOrDeployEventSpammer(deployer: SignerWithAddress) {
  let eventSpammer: EventSpammer;
  if (!EVENT_SPAMMER_ADDR) {
    const { eventSpammer: output } = await deployEventSpammer(deployer);
    eventSpammer = output;
  } else {
    console.log("Using existing event spamemer at ", EVENT_SPAMMER_ADDR);
    eventSpammer = await ethers.getContractAt(
      "EventSpammer",
      EVENT_SPAMMER_ADDR
    );
  }
  return { eventSpammer };
}

async function deployNProxyContracts(
  deployers: SignerWithAddress[],
  n: number
): Promise<string[]> {
  if (deployers.length === 0) {
    throw new Error("No deployers provided to deployNProxyContracts");
  }

  const { eventSpammer: rawEventSpammer } = await resolveOrDeployEventSpammer();
  let functions: string[] = [];
  let ownerAddr = ethers.Wallet.createRandom().address;
  const categories = [
    "Price Feed",
    "NFT",
    "Random X",
    "Derivatives",
    "Web2 API",
    "Messaging",
    "Weather",
    "Meta",
    "Other",
    "The Literal Sun",
  ];
  for (let i = 0; i < n; i++) {
    //Get a random deployer
    const eventSpammer = rawEventSpammer.connect(deployers[0]);

    const name = randomWords({
      exactly: Math.floor(Math.random() * 7) + 3,
      join: " ",
    });
    const desc = randomWords({
      exactly: Math.floor(Math.random() * 10) + 10,
      join: " ",
    });

    console.log(categories);
    console.log(categories.length);
    console.log(Math.floor(Math.random() * categories.length));
    const category = ethers.utils.formatBytes32String(
      categories[Math.floor(Math.random() * categories.length)]
    );

    const functionId = keccak256(ethers.Wallet.createRandom().publicKey);
    console.log("Emitting registered event for", functionId);

    if (i % 3 == 0) {
      ownerAddr = ethers.Wallet.createRandom().address;
    }
    const registerTransaction = await eventSpammer.emitRegisterFunction(
      functionId,
      ownerAddr,
      name,
      desc,
      "", //TODO Image url
      randomWords({ exactly: Math.floor(Math.random() * 2) + 1 }), //expectedArgs
      category,
      BigNumber.from(Math.floor(Math.random() * 10000000) + 100000), // subId
      ONE_LINK.div(10), // fee
      0, //location,
      "console.log('hello world')" //source
    );
    const receipt = await registerTransaction.wait();
    const event = receipt.events?.find((e) => e.event === "FunctionRegistered");
    // console.log("Function registered event: ", event);
    functions.push(ownerAddr);
  }

  return functions;
}

//This function will get all FunctionRegistered events and creates 5-10 FunctionCalled events for each
//startIndex can be passed to start from a specific registration event
const generateNFunctionCalls = async (
  eventSpammer: EventSpammer,
  startIndex: number = 0
) => {
  const registeredFunctions = await eventSpammer.queryFilter(
    eventSpammer.filters.FunctionRegistered()
  );

  if (registeredFunctions.length < startIndex) {
    throw new Error(
      "Start index is greater than the number of registered functions"
    );
  }
  for (let i = 0; i < registeredFunctions.length; i++) {
    const func = registeredFunctions[i].args;
    console.log(
      "Calling function",
      i,
      "of",
      registeredFunctions.length,
      "with address",
      func.functionId
    );

    // let promiseArray = [];
    const numberOfCalls = Math.floor(Math.random() * 10) + 5;
    for (let j = 0; j < numberOfCalls; j++) {
      console.log(
        `Calling function ${j} of ${numberOfCalls} for ${func.functionId}`
      );
      // promiseArray.push(
      await eventSpammer.emitCallFunction(
        func.functionId,
        formatBytes32String("requestId " + j),
        ethers.Wallet.createRandom().address, //Caller
        registeredFunctions[i].args.owner,
        formatBytes32String("callbackName"),
        Math.floor(Math.random() * 300_000),
        ONE_LINK.div(100).mul(Math.floor(Math.random() * 100))
      );
      // );
      // if (j % 3 === 0) {
      // await Promise.all(promiseArray);
      // promiseArray = [];
      // }
    }
    // await Promise.all(promiseArray);
  }
};

const generateNFunctionResolved = async (
  eventSpammer: EventSpammer,
  startIndex: number = 0
) => {
  const registeredFunctions = await eventSpammer.queryFilter(
    eventSpammer.filters.FunctionRegistered()
  );

  if (registeredFunctions.length < startIndex) {
    throw new Error(
      "Start index is greater than the number of registered functions"
    );
  }
  for (let i = 0; i < registeredFunctions.length; i++) {
    const func = registeredFunctions[i].args;
    console.log(
      "Calling function",
      i,
      "of",
      registeredFunctions.length,
      "with address",
      func.functionId
    );

    let promiseArray = [];
    const numberOfCalls = Math.floor(Math.random() * 5) + 2;
    for (let j = 0; j < numberOfCalls; j++) {
      console.log(
        `Calling function ${j} of ${numberOfCalls} for ${func.functionId}`
      );
      promiseArray.push(
        eventSpammer.emitCallbackWithData(
          func.functionId,
          registeredFunctions[i].args.owner,
          ethers.Wallet.createRandom().address, //caller
          formatBytes32String("requestId " + j),
          formatBytes32String("callbackName"),
          Math.floor(Math.random() * 300_000), //usedGas
          Buffer.from(randomWords({ exactly: 32, join: " " })),
          Buffer.from(randomWords({ exactly: 32, join: " " }))
        )
      );
    }
    await Promise.all(promiseArray);
  }
};

async function main() {
  const [deployer, o2, o3, o4, o5] = await ethers.getSigners();
  // const [o1, deployer, o3, o4, o5] = await ethers.getSigners();
  const { eventSpammer } = await resolveOrDeployEventSpammer(deployer);
  
  await deployNProxyContracts([deployer], 5);
  // await generateNFunctionCalls(eventSpammer, 3);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
