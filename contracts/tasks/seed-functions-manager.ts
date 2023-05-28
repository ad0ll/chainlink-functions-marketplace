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
          "0x5f5cad2778707654691b9276b6efcc451154287a5e6f1d24a3a068799348619c",
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
            [user3.address]: { caller: user3, args: ["1000000", "500"] },
            [user4.address]: { caller: user4, args: ["2500000", "300"] },
          },
          gasLimit: 500_000,
        },
      },
      {
        functionId:
          "0xa3e7e69dd8bac0c4506af68d25c5aff3e163493cce345f187e34906ccc936bb8",
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
            [user3.address]: { caller: user3, args: ["100", "200", "300"] },
            [user4.address]: { caller: user4, args: ["12", "9", "23", "6"] },
          },
          gasLimit: 500_000,
        },
      },
      {
        functionId:
          "0x144853f43d3b8e966203b3f8ae15dae36c91b9269c55fb4114d92e24c82b6df4",
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
            [user2.address]: { caller: user2, args: ["bitcoin", "usd"] },
            [user4.address]: { caller: user4, args: ["ethereum", "eur"] },
          },
          gasLimit: 500_000,
        },
      },
      {
        functionId:
          "0xb7ced75f5bc1d50bd5cfebba6436321806d7fdb1e31c1e9ebf3440fd6fe66707",
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
            [user2.address]: { caller: user2, args: ["BTC", "USD"] },
            [user3.address]: { caller: user3, args: ["BTC", "ETH"] },
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

    if (taskArgs.registerfunctions) {
      console.log("Registering functions...");
      for (let i = 0; i < demos.length; i++) {
        const demo = demos[i];
        const owner = demo.owner;
        const localFm = functionsManagerRaw.connect(owner);

        const registerCall = await localFm.registerFunction(demo.register, {
          gasLimit: 2_000_000,
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
      console.log(`${signer.address} approving functions manager as spender `);

      const linkToken = linkTokenRaw.connect(signer);
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
            gasLimit: 2_000_000,
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
  });
