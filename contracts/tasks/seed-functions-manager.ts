import { task, types } from "hardhat/config";
import fs from "fs";
import { FunctionsManager } from "../typechain-types";
import { networks } from "../hardhat.config";
import { keccak256 } from "ethers/lib/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as ethCrypto from "eth-crypto";

type DemoConfig = {
  functionId: string;
  owner: SignerWithAddress;
  register: FunctionsManager.FunctionsRegisterRequestStruct;
  execute: {
    args: string[][];
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
    const functionsManagerRaw = await ethers.getContractAt(
      "FunctionsManager",
      taskArgs.functionsmanager
    );

    const encrypt = async (message: string) => {
      const encrypted = await ethCrypto.default.encryptWithPublicKey(
        networks[network.name].functionsPublicKey,
        message
      );
      const encryptedStr = ethCrypto.default.cipher.stringify(encrypted);
      return "0x" + encryptedStr;
    };

    const demos: DemoConfig[] = [
      {
        functionId: "",
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
          expectedReturnType: 1, //uint256
        },
        execute: {
          args: [
            ["1000000", "450"],
            ["1000000", "500"],
            ["2500000", "300"],
          ],
          gasLimit: 1_000_000,
        },
      },
      {
        functionId: "",
        owner: user2,
        register: {
          fees: ethers.utils.parseEther("0.02"),
          functionName: "Geometric Mean",
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
          expectedReturnType: 1, //uint256
        },
        execute: {
          args: [
            ["1", "2"],
            ["100", "200", "300"],
            ["12", "9", "23", "6"],
          ],
          gasLimit: 500_000,
        },
      },
      {
        functionId: "",
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
          expectedReturnType: 1, //uint256
        },
        execute: {
          args: [
            ["ethereum", "usd"],
            ["bitcoin", "usd"],
            ["ethereum", "eur"],
            ["ethereum"],
          ],
          gasLimit: 500_000,
        },
      },
      {
        functionId: "",
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
          expectedReturnType: 1, //uint256
        },
        execute: {
          args: [
            ["ETH", "USD"],
            ["BTC", "USD"],
            ["BTC", "ETH"],
          ],
          gasLimit: 500_000,
        },
      },
      {
        functionId: "",
        owner: user1,
        register: {
          fees: ethers.utils.parseEther("0.01"),
          functionName: "Coinpaprika Price",
          desc: "Fetches a given price pair from Coinpaprika",
          imageUrl: imageUrls.ethLogo,
          expectedArgs: ["Base", "Quote"],
          codeLocation: 0,
          secretsLocation: 0,
          language: 0,
          category: ethers.utils.formatBytes32String("Price Feed"),
          subId: process.env.FUNCTIONS_SUBSCRIPTION_ID,
          source: fs.readFileSync("./demos/coinpaprika-price.js").toString(),
          secrets: [],
          expectedReturnType: 1, //uint256
        },
        execute: {
          args: [
            ["eth-ethereum", "USD"],
            ["btc-bitcoin", "USD"],
            ["btc-bitcoin", "ETH"],
          ],
          gasLimit: 500_000,
        },
      },
      {
        functionId: "",
        owner: user2,
        register: {
          fees: ethers.utils.parseEther("0.06"),
          functionName: "Coinmarketcap Price",
          desc: "Fetches a given price pair from Coinmarketcap",
          imageUrl: imageUrls.ethLogo,
          expectedArgs: ["Base", "Quote"],
          codeLocation: 0,
          secretsLocation: 1,
          language: 0,
          category: ethers.utils.formatBytes32String("Price Feed"),
          subId: process.env.FUNCTIONS_SUBSCRIPTION_ID,
          source: fs.readFileSync("./demos/coinmarketcap-price.js").toString(),
          secrets: encrypt(
            "https://gist.github.com/amith4m/7a3df0721d771c08d511584a85bc099b/raw"
          ),

          expectedReturnType: 1, //uint256
        },
        execute: {
          args: [
            ["1", "USD"],
            ["1027", "USD"],
          ],
          gasLimit: 500_000,
        },
      },
      {
        functionId: "",
        owner: user3,
        register: {
          fees: ethers.utils.parseEther("0.05"),
          functionName: "Multi API Aggregator",
          desc: "Fetches a given asset's price in USD from multiple providers and aggregates the median",
          imageUrl: imageUrls.ethLogo,
          expectedArgs: [
            "Base Coinmarketcap",
            "Base Coingecko",
            "Base Coinpaprika",
            "Base Bad API",
          ],
          codeLocation: 0,
          secretsLocation: 1,
          language: 0,
          category: ethers.utils.formatBytes32String("Price Feed"),
          subId: process.env.FUNCTIONS_SUBSCRIPTION_ID,
          source: fs.readFileSync("./demos/multi-api-example.js").toString(),
          secrets: encrypt(
            "https://gist.github.com/amith4m/7a3df0721d771c08d511584a85bc099b/raw"
          ),
          expectedReturnType: 1, //uint256
        },
        execute: {
          args: [
            ["1", "bitcoin", "btc-bitcoin", "btc"],
            ["1027", "ethereum", "eth-ethereum", "eth"],
            ["btc", "btc", "btc", "btc"],
          ],
          gasLimit: 500_000,
        },
      },
      {
        functionId: "",
        owner: user4,
        register: {
          fees: ethers.utils.parseEther("0.05"),
          functionName: "Weather Forecast",
          desc: "Fetches short weather forecast for latitude and longitude",
          imageUrl: imageUrls.ethLogo,
          expectedArgs: ["latitude", "longitude"],
          codeLocation: 0,
          secretsLocation: 0,
          language: 0,
          category: ethers.utils.formatBytes32String("Weather Data"),
          subId: process.env.FUNCTIONS_SUBSCRIPTION_ID,
          source: fs.readFileSync("./demos/weather-data.js").toString(),
          secrets: [],
          expectedReturnType: 3, //string
        },
        execute: {
          args: [["39.7456", "-97.0892"]],
          gasLimit: 500_000,
        },
      },
    ];
    console.log("Finished bootstrapping demos");

    console.log("Function manager owner: ", functionsManagerOwner.address);
    const FunctionsBillingRegistry = await ethers.getContractAt(
      "FunctionsBillingRegistry",
      networks[network.name].functionsBillingRegistryProxy
    );

    console.log("Registering functions...");
    for (let i = 0; i < demos.length; i++) {
      const demo = demos[i];
      const owner = demo.owner;

      const localFm = functionsManagerRaw.connect(owner);

      const functionId = keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["string", "address"],
          [demo.register.functionName, demo.owner.address]
        )
      );
      const existingFunction = await localFm.getFunctionMetadata(functionId);
      if (existingFunction.name !== "") {
        console.log(
          `Function Name: ${existingFunction.name} | Owner: ${existingFunction.owner} | Function ID: ${functionId}`
        );
        console.log("Function already registered, skipping");
        demo.functionId = functionId;
        continue;
      }
      console.log("Function does not exist, registering...");

      console.log("Getting subscription info for: ", demo.register.subId);
      const subInfo = await FunctionsBillingRegistry.getSubscription(
        demo.register.subId
      );

      console.log(
        "Subscription balance: ",
        ethers.utils.formatEther(subInfo.balance.toString())
      );
      if (subInfo.balance.lte(ethers.utils.parseEther("3"))) {
        throw new Error("Not enough balance in subscription");
      }
      let managerAuthorized = false;
      let ownerAuthorized = owner.address === subInfo.owner;
      for (const consumer of subInfo.consumers) {
        if (consumer === functionsManagerRaw.address) {
          managerAuthorized = true;
        }
        if (consumer === owner.address) {
          ownerAuthorized = true;
        }
      }

      if (!managerAuthorized) {
        throw new Error(
          "Function Manager not authorized as consumer on subscription"
        );
      }

      if (!ownerAuthorized) {
        throw new Error("Owner not authorized as consumer on subscription");
      }

      const registerCall = await localFm.registerFunction(demo.register, {
        gasLimit: 4_000_000,
        gasPrice: 30_000_000_000,
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
      for (let j = 0; j < demo.execute.args.length; j++) {
        console.log(
          `Starting run ${j + 1}/${demo.execute.args.length} for ${functionId}`
        );
        const args = demo.execute.args[j];

        const functionManagerWithCaller = functionsManagerRaw.connect(
          functionsManagerOwner
        );

        console.log(
          `Executing function ${demo.register.functionName} as ${functionsManagerOwner.address}`
        );
        const tx = await functionManagerWithCaller.executeRequest(
          functionId,
          args,
          {
            gasLimit: 2_500_000,
          }
        );
        const execReceipt = await tx.wait(1);
        console.log(
          `Finished run ${j + 1}/${demo.execute.args.length} for ${
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
