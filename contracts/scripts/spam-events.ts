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
let EVENT_SPAMMER_ADDR = "0xf8964311C73E80a235cfaf06A57eaeb15FFE54Cb";
async function deployEventSpammer() {
  //TODO deploy event spammer with real account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const EventSpammer = await ethers.getContractFactory("EventSpammer");
  const eventSpammer = await EventSpammer.deploy();
  console.log("EventSpammer address:", eventSpammer.address);
  EVENT_SPAMMER_ADDR = eventSpammer.address;
  return { eventSpammer };
}

async function resolveOrDeployEventSpammer() {
  let eventSpammer: EventSpammer;
  if (!EVENT_SPAMMER_ADDR) {
    const { eventSpammer: output } = await deployEventSpammer();
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

async function deployEmptyProxy() {
  //TODO deploy event spammer with real account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying empty proxy with the account:", deployer.address);
  const EventSpammer = await ethers.getContractFactory("EventSpammer");
  const eventSpammer = await EventSpammer.deploy();
  console.log("EventSpammer address:", eventSpammer.address);
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
  for (let i = 0; i < n; i++) {
    //Get a random deployer
    const deployerIndex = Math.floor(Math.random() * deployers.length);
    const deployer = deployers[deployerIndex];
    const eventSpammer = rawEventSpammer.connect(deployers[0]);

    const name = randomWords({
      exactly: Math.floor(Math.random() * 7) + 3,
      join: " ",
    });
    const desc = randomWords({
      exactly: Math.floor(Math.random() * 10) + 10,
      join: " ",
    });

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
      BigNumber.from(Math.floor(Math.random() * 10000000) + 100000), // subId
      ONE_LINK.div(10)
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
        formatBytes32String("callbackName"),
        registeredFunctions[i].args.owner,
        ethers.Wallet.createRandom().address,
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
    const numberOfCalls = Math.floor(Math.random() * 10) + 5;
    for (let j = 0; j < numberOfCalls; j++) {
      console.log(
        `Calling function ${j} of ${numberOfCalls} for ${func.functionId}`
      );
      promiseArray.push(
        eventSpammer.emitCallbackWithData(
          func.functionId,
          registeredFunctions[i].args.owner,
          ethers.Wallet.createRandom().address,
          formatBytes32String("requestId " + j),
          formatBytes32String("callbackName"),
          Buffer.from(randomWords({ exactly: 32, join: " " })),
          Buffer.from(randomWords({ exactly: 32, join: " " }))
        )
      );
    }
    await Promise.all(promiseArray);
  }
};

async function main() {
  const { eventSpammer } = await resolveOrDeployEventSpammer();
  const [deployer, o2, o3, o4, o5] = await ethers.getSigners();
  // await deployNProxyContracts([deployer], 10);
  await generateNFunctionCalls(eventSpammer, 0);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
