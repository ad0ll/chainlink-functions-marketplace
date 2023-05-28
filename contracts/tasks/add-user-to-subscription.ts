import { task } from "hardhat/config";
// import { ethers } from "hardhat";

// NOTE: This contains code copied or adapted from CLL's hardhat repo: tasks/Functions-billing/create.js
const {
  VERIFICATION_BLOCK_CONFIRMATIONS,
  networkConfig,
} = require("./../../contracts/network-config.js");
task(
  "add-user-to-subscription",
  "Creates a new billing subscription for Functions consumer contracts"
)
  .addOptionalParam(
    "testNetwork",
    "The network to use, defaulting to polygonMumbai",
    "polygonMumbai",
    undefined
  )
  .addParam(
    "privatekey",
    "some authorized consumer of the subscription",
    process.env.PRIVATE_KEY
  )
  .addParam("subscriptionid", "the subscription to add the user to", undefined)
  .addParam("authorizeuser", "address of the user to authorize", undefined)
  .setAction(async (taskArgs, { ethers }) => {
    if (taskArgs.testNetwork === "hardhat") {
      throw Error(
        "This command cannot be used on a local hardhat chain, pass --network with polygonMumbai or sepolia"
      );
    }

    console.log(
      "Getting the billing registry contract at",
      networkConfig[taskArgs.testNetwork]["functionsBillingRegistryProxy"]
    );
    const RegistryFactory = await ethers.getContractFactory(
      "FunctionsBillingRegistry"
    );
    const registry = await RegistryFactory.attach(
      networkConfig[taskArgs.testNetwork]["functionsBillingRegistryProxy"]
    );

    console.log(
      "Getting the Functions Oracle contract at",
      networkConfig[taskArgs.testNetwork]["functionsOracleProxy"]
    );
    const Oracle = await ethers.getContractFactory("FunctionsOracle");
    const oracle = await Oracle.attach(
      networkConfig[taskArgs.testNetwork]["functionsOracleProxy"]
    );

    console.log("Checking if wallet is authorized to create subscriptions");
    console.log("Signer private key: ", taskArgs.privatekey);
    // const signer = new ethers.Wallet("provider?", taskArgs.privatekey);
    const [signer] = await ethers.getSigners();
    const testSigner = await ethers.getSigner(
      "0x9B73FC82Ea166ceAd839ff6EF476ac2e696dBA63"
    );
    console.log("testSigner", testSigner);
    console.log("Signer: ", signer);
    console.log("Signer address: ", signer.address);

    const isWalletAllowed = await oracle.isAuthorizedSender(signer.address);
    if (!isWalletAllowed) {
      return console.log(
        "\nChainlink Functions is currently in a closed testing phase.\nFor access sign up here:\nhttps://functions.chain.link"
      );
    }
    console.log("Wallet is authorized to create subscriptions");


     const subscriptionId = parseInt(taskArgs.subscriptionid);
     const authorizeUser = taskArgs.authorizeuser;
      // Add consumer
      console.log(
        `Adding consumer address ${authorizeUser} to subscription ${subscriptionId}`
      );
      const addTx = await registry.addConsumer(
        subscriptionId,
        authorizeUser
      );
      console.log(
        `Waiting ${VERIFICATION_BLOCK_CONFIRMATIONS} blocks for transaction ${addTx.hash} to be confirmed...`
      );
      await addTx.wait(VERIFICATION_BLOCK_CONFIRMATIONS);

      console.log(`Authorized user: ${authorizeUser}`);
    });
