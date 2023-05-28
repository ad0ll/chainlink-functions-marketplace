import { task, types } from "hardhat/config";
import fs from "fs";
import { FunctionsManager } from "../typechain-types";
import { networks } from "../hardhat.config";
import { Signer } from "ethers";

type DemoConfig = {
  functionId: string;
  owner: Signer;
  register: FunctionsManager.FunctionsRegisterRequestStruct;
  execute: {
    callers: Record<string, { caller: Signer; args: string[] }>;
    gasLimit: number;
  };
};

const imageUrls = {
  maxHeadroom: "https://i.imgur.com/VE7uGB9.gif",
  //TODO Swap below with the official version (Google Drive link: https://drive.google.com/drive/folders/1owvdEhRDtmwxE-7cAdxBXhjswiDPDT9W) uploaded on the vercel app since we can't get a direct link from google drive
  coingecko:
    "https://i.pinimg.com/736x/be/c9/b3/bec9b33d6638ff927a96d0e93546a056.jpg",
  calculateApy:
    "https://upload.wikimedia.org/wikipedia/commons/1/18/Simple_calculator.svg",
  ethLogo:
    "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg",
};

task(
  "seed-functions-manager",
  "registers multiple functions under different owners and executes each with different users"
)
  .addOptionalParam(
    "functionsmanager",
    "The address of the function manager",
    process.env.FUNCTION_MANAGER_ADDR,
    types.string
  )
  .addOptionalParam(
    "registerfunctions",
    "Whether to register functions",
    true,
    types.boolean
  )
  .setAction(async (taskArgs, { ethers, network }) => {
    console.log("Building demos");

    if (!process.env.FUNCTIONS_SUBSCRIPTION_ID) {
      throw Error("FUNCTIONS_SUBSCRIPTION_ID must be set");
    }

    if (!taskArgs.functionsmanager) {
      throw new Error("--functionsmanager must be specified");
    }

    const [functionsManagerOwner, user1, user2, user3, user4] =
      await ethers.getSigners();
    const signers = [functionsManagerOwner, user1, user2, user3, user4];

    const demos: DemoConfig[] = [
      {
        functionId:
          "0x1f74d62f6e1316c0e29016c5c0e3858b5ff9268df2ba20b1681079bfe2eaef0d",
        owner: user1,
        register: {
          fees: ethers.utils.parseEther("0.02"),
          functionName: "Compound Interest",
          desc: "Calculate a continuously compounding interested rate",
          imageUrl: imageUrls.calculateApy,
          expectedArgs: ["Principal Amount", "APY times 100"],
          codeLocation: 0,
          secretsLocation: 0,
          language: 0,
          category: ethers.utils.formatBytes32String("Calculations"),
          subId: process.env.FUNCTIONS_SUBSCRIPTION_ID,
          source: fs.readFileSync("./demos/compound-interest.js").toString(),
          secrets: [],
        },
        execute: {
          callers: {
            [user2.address]: { caller: user2, args: ["1000000", "450"] },
            // [user3.address]: { caller: user3, args: ["1000000", "500"] },
            // [user4.address]: { caller: user4, args: ["2500000", "300"] },
          },
          gasLimit: 1_000_000,
        },
      },
      {
        functionId:
          "0xf542a86f16d4d82d9ac34bb8861d40a73f19f4e51b467a1b55b43cad25057ce5",
        owner: user2,
        register: {
          fees: ethers.utils.parseEther("0.02"),
          functionName: "Geometric Mean Example",
          desc: "Calculate a geometric mean",
          imageUrl: imageUrls.calculateApy,
          expectedArgs: ["Varying numeric args"],
          codeLocation: 0,
          secretsLocation: 0,
          language: 0,
          category: ethers.utils.formatBytes32String("Calculations"),
          subId: process.env.FUNCTIONS_SUBSCRIPTION_ID,
          source: fs.readFileSync("./demos/geometric-mean.js").toString(),
          secrets: [],
        },
        execute: {
          callers: {
            [user1.address]: { caller: user1, args: ["1", "2"] },
            // [user3.address]: { caller: user3, args: ["100", "200", "300"] },
            // [user4.address]: { caller: user4, args: ["12", "9", "23", "6"] },
          },
          gasLimit: 500_000,
        },
      },
      {
        functionId:
          "0x1cad7a1167bd441b2a8e30bbd40637f03ace876976424bdadce5e8d2b7edd012",
        owner: user3,
        register: {
          fees: ethers.utils.parseEther("0.05"),
          functionName: "CoinGecko Price",
          desc: "Fetches a given price pair from CoinGecko",
          imageUrl: imageUrls.coingecko,
          expectedArgs: [
            "base;string;See the following for all possible values: https://api.coingecko.com/api/v3/coins/list",
            "quote;string;See the following for all possible values: https://api.coingecko.com/api/v3/coins/list",
          ],
          codeLocation: 0,
          secretsLocation: 0,
          language: 0,
          category: ethers.utils.formatBytes32String("Price Feed"),
          subId: process.env.FUNCTIONS_SUBSCRIPTION_ID,
          source: fs.readFileSync("./demos/coingecko-price.js").toString(),
          secrets: [],
        },
        execute: {
          callers: {
            [user1.address]: { caller: user1, args: ["ethereum", "usd"] },
            // [user2.address]: { caller: user2, args: ["bitcoin", "usd"] },
            // [user4.address]: { caller: user4, args: ["ethereum", "eur"] },
          },
          gasLimit: 500_000,
        },
      },
      {
        functionId:
          "0xf32eee13ccd65bffbe943934a4788f3da1a096e474bbb09bd0a98911d28d3770",
        owner: user4,
        register: {
          fees: ethers.utils.parseEther("0.05"),
          functionName: "CryptoCompare Price",
          desc: "Fetches a given price pair from CryptoCompare",
          imageUrl: imageUrls.ethLogo,
          expectedArgs: ["Base", "Quote"],
          codeLocation: 0,
          secretsLocation: 0,
          language: 0,
          category: ethers.utils.formatBytes32String("Price Feed"),
          subId: process.env.FUNCTIONS_SUBSCRIPTION_ID,
          source: fs.readFileSync("./demos/cryptocompare-price.js").toString(),
          secrets: [],
        },
        execute: {
          callers: {
            [user1.address]: { caller: user1, args: ["ETH", "USD"] },
            // [user2.address]: { caller: user2, args: ["BTC", "USD"] },
            // [user3.address]: { caller: user3, args: ["BTC", "ETH"] },
          },
          gasLimit: 500_000,
        },
      },
    ];
    console.log("Finished bootstrapping demos");

    const functionsManagerRaw = await ethers.getContractAt(
      "FunctionsManager",
      taskArgs.functionsmanager
    );
    console.log("Function manager owner: ", functionsManagerOwner.address);
    const FunctionsBillingRegistry = await ethers.getContractAt(
      "FunctionsBillingRegistry",
      networks[network.name].functionsBillingRegistryProxy
    );

    console.log(
      "Getting subscription info for: ",
      process.env.FUNCTIONS_SUBSCRIPTION_ID
    );
    const subInfo = await FunctionsBillingRegistry.getSubscription(
      process.env.FUNCTIONS_SUBSCRIPTION_ID
    );
    // console.log("Subscription info: ", subInfo);
    console.log(
      "Subscription balance: ",
      ethers.utils.formatEther(subInfo.balance.toString())
    );
    //TODO Scan consumers for function
    if (subInfo.balance.lte(ethers.utils.parseEther("3"))) {
      throw new Error("Not enough balance in subscription");
    }

    if (taskArgs.registerfunctions) {
      console.log("Registering functions...");
      for (let i = 0; i < demos.length; i++) {
        const demo = demos[i];
        const owner = demo.owner;
        const localFm = functionsManagerRaw.connect(owner);

        const existingFunction = await localFm.getFunctionMetadata(
          demo.functionId
        );
        console.log("Existing function: ", existingFunction);
        if (existingFunction.name !== "") {
          console.log("Function already registered, skipping");
          continue;
        }

        const registerCall = await localFm.registerFunction(demo.register, {
          gasLimit: 2_500_000,
          //   gasPrice: ethers.utils.parseUnits("35", "gwei"),
        });
        const receipt = await registerCall.wait(1);
        console.log(
          "Finished registering function: ",
          demo.register.functionName
        );

        const registerEvent = receipt.events?.find(
          (e) => e.event === "FunctionRegistered"
        );
        if (!registerEvent) {
          throw new Error("No FunctionRegistered event found");
        }
        if (registerEvent.args) {
          console.log(
            `Generated Function ID ${registerEvent.args[0]} for ${demo.register.functionName}`
          );
          demo.functionId = registerEvent.args[0];
        }
      }
    }

    const linkTokenRaw = await ethers.getContractAt(
      "LinkToken",
      networks[network.name].linkToken
    );

    for (let i = 0; i < signers.length; i++) {
      const signer = signers[i];
      console.log(
        `${signer.address} approving functions manager ${functionsManagerRaw.address} as spender `
      );
      const linkToken = linkTokenRaw.connect(signer);
      const allow = await linkToken.allowance(
        signer.address,
        functionsManagerRaw.address
      );
      console.log("Allowance: ", ethers.utils.formatEther(allow.toString()));
      if (allow.gte(ethers.utils.parseEther("5"))) {
        console.log("Functions manager already approved, skipping...");
        continue;
      }
      const approveTx = await linkToken.approve(
        functionsManagerRaw.address,
        ethers.utils.parseEther("10")
      );
      // Wait for LINK approval
      await approveTx.wait(1);
    }

    // Execute each function
    for (let i = 0; i < demos.length; i++) {
      const demo = demos[i];
      const functionId = demo.functionId;
      const callerList = Object.entries(demo.execute.callers);
      for (let j = 0; j < callerList.length; j++) {
        console.log(
          `Starting run ${j + 1}/${callerList.length} for ${functionId}`
        );
        const [callerAddr, requestInfo] = callerList[j];

        const functionManagerWithCaller = functionsManagerRaw.connect(
          functionsManagerOwner // TODO: change to unique callers
        );

        console.log(
          `Executing function ${demo.register.functionName} as ${functionsManagerOwner.address}`
        );
        const tx = await functionManagerWithCaller.executeRequest(
          functionId,
          requestInfo.args,
          300_000,
          {
            gasLimit: 2_500_000,
            // gasPrice: ethers.utils.parseUnits("35", "gwei"),
            // maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei"),
            // maxFeePerGas: ethers.utils.parseUnits("5", "gwei"),
          }
        );
        const execReceipt = await tx.wait(1);
        console.log(
          `Finished run ${j + 1}/${callerList.length} for ${
            demo.register.functionName
          }`
        );
        const calledEvent = execReceipt.events?.find(
          (e) => e.event === "FunctionCalled"
        );
        if (!calledEvent) {
          throw new Error("No FunctionCalled event found");
        }
        if (calledEvent.args) {
          console.log(`Called ${demo.register.functionName}`);
          console.log(`Request ID: ${calledEvent.args[1]}`);
        }
      }
    }

    // TODO Check that the events have come through
    console.log("Withdrawing LINK from functions manager");
    console.log("Withdrawing FunctionsManager owner profit");
    const functionManagerWithdrawOwner = functionsManagerRaw.connect(
      functionsManagerOwner // TODO: change to unique callers
    );
    const withdrawTxRaw =
      await functionManagerWithdrawOwner.withdrawFunctionsManagerProfitToOwner();
    const withdrawTx = await withdrawTxRaw.wait(1);
    console.log(
      "Finished withdrawing FunctionsManager owner profit",
      withdrawTx
    );
    for (let i = 0; i < demos.length; i++) {
      const author = demos[i].owner;
      const functionManagerWithdrawAuthor = functionsManagerRaw.connect(author);
      const withdrawAuthorTxRaw =
        await functionManagerWithdrawAuthor.withdrawFunctionProfitToAuthor(
          demos[i].functionId
        );
      const withdrawAuthorTx = await withdrawAuthorTxRaw.wait(1);
      console.log("Finished withdrawing author profit", withdrawAuthorTx);
    }
  });
