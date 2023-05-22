import { task } from "hardhat/config";
// import { ethers } from "hardhat";

// NOTE: This contains code copied or adapted from CLL's hardhat repo: tasks/Functions-billing/create.js
const {
  VERIFICATION_BLOCK_CONFIRMATIONS,
  networkConfig,
} = require("./../../contracts/network-config.js");
task(
  "create-subscription",
  "Creates a new billing subscription for Functions consumer contracts"
)
  .addOptionalParam(
    "testNetwork",
    "The network to use, defaulting to polygonMumbai",
    "polygonMumbai",
    undefined
  )
  .addParam(
    "functionsmanager",
    "The address of the function manager",
    process.env.FUNCTION_MANAGER_ADDRESS,
    undefined,
    false
  )
  .addOptionalParam(
    "privatekey",
    "The private key of the account to send tx from",
    process.env.PRIVATE_KEY
  )
  .addOptionalParam(
    "subscriptionid",
    "if provided won't create a subscription",
    undefined
  )
  .setAction(async (taskArgs, { ethers }) => {
    if (taskArgs.testNetwork === "hardhat") {
      throw Error(
        "This command cannot be used on a local hardhat chain, pass --network with polygonMumbai or sepolia"
      );
    }

    // const linkAmount = taskArgs.amount;

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
    console.log("Signer: ", signer);
    console.log("Signer address: ", signer.address);
    // TODO: Remove the following 6 lines on open access

    // const isWalletAllowed = await oracle.isAuthorizedSender(signer.address);
    // if (!isWalletAllowed) {
    //   return console.log(
    //     "\nChainlink Functions is currently in a closed testing phase.\nFor access sign up here:\nhttps://functions.chain.link"
    //   );
    // }
    console.log("Wallet is authorized to create subscriptions");

    console.log(
      "Getting the Functions Manager contract at",
      taskArgs.functionsmanager
    );
    const functionManagerRaw = await ethers.getContractAt(
      "FunctionsManager",
      taskArgs.functionsmanager
    );
    const functionManager = await functionManagerRaw.connect(signer);
    // console.log(functionManager);
    console.log(
      "connected to function manager, fetching minimum subscription deposit"
    );
    console.log(functionManager.address);
    console.log(signer.address);
    const linkAmount = await functionManager.minimumSubscriptionDeposit();
    console.log("minimum subscription deposit is: ", linkAmount.toString());

    let subscriptionId: number;
    if (taskArgs.subscriptionid) {
      subscriptionId = parseInt(taskArgs.subscriptionid);
    } else {
      console.log("Creating Functions billing subscription");
      const createSubscriptionTx = await registry.createSubscription({
        gasLimit: 2_000_000,
      });

      // If a consumer or linkAmount was also specified, wait 1 block instead of VERIFICATION_BLOCK_CONFIRMATIONS blocks
      const createWaitBlockConfirmations =
        functionManager.address || linkAmount
          ? 1
          : VERIFICATION_BLOCK_CONFIRMATIONS;
      console.log(
        `Waiting ${createWaitBlockConfirmations} blocks for transaction ${createSubscriptionTx.hash} to be confirmed...`
      );
      const createSubscriptionReceipt = await createSubscriptionTx.wait(
        createWaitBlockConfirmations
      );

      if (!createSubscriptionReceipt.events?.[0].args?.["subscriptionId"]) {
        throw new Error("Subscription creation failed");
      }
      subscriptionId =
        createSubscriptionReceipt.events[0].args["subscriptionId"].toNumber();
    }

    console.log(`Subscription created with ID: ${subscriptionId}`);

    if (linkAmount) {
      console.log(
        "Funding subscription",
        subscriptionId,
        "with",
        linkAmount,
        "LINK"
      );

      const LinkTokenFactory = await ethers.getContractFactory("LinkToken");
      const linkToken = await LinkTokenFactory.attach(
        networkConfig[taskArgs.testNetwork]["linkToken"]
      );

      const accounts = await ethers.getSigners();
      const signer = accounts[0];

      // Check for a sufficent LINK balance to fund the subscription
      const balance = await linkToken.balanceOf(signer.address);
      if (linkAmount.gt(balance)) {
        throw Error(
          `Insufficent LINK balance. Trying to fund subscription with ${ethers.utils.formatEther(
            linkAmount
          )} LINK, but only have ${ethers.utils.formatEther(balance)}.`
        );
      }

      console.log(`Funding with ${ethers.utils.formatEther(linkAmount)} LINK`);
      const fundTx = await linkToken.transferAndCall(
        networkConfig[taskArgs.testNetwork]["functionsBillingRegistryProxy"],
        linkAmount,
        ethers.utils.defaultAbiCoder.encode(["uint64"], [subscriptionId]),
        { gasLimit: 2_000_000 }
      );
      // If a consumer was also specified, wait 1 block instead of VERIFICATION_BLOCK_CONFIRMATIONS blocks
      const fundWaitBlockConfirmations = !!functionManager.address
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;
      console.log(
        `Waiting ${fundWaitBlockConfirmations} blocks for transaction ${fundTx.hash} to be confirmed...`
      );
      await fundTx.wait(fundWaitBlockConfirmations);

      console.log(
        `Subscription ${subscriptionId} funded with ${ethers.utils.formatEther(
          linkAmount
        )} LINK`
      );
    }

    if (functionManager.address) {
      // Add consumer
      console.log(
        `Adding consumer contract address ${functionManager.address} to subscription ${subscriptionId}`
      );
      const addTx = await registry.addConsumer(
        subscriptionId,
        functionManager.address
      );
      console.log(
        `Waiting ${VERIFICATION_BLOCK_CONFIRMATIONS} blocks for transaction ${addTx.hash} to be confirmed...`
      );
      await addTx.wait(VERIFICATION_BLOCK_CONFIRMATIONS);

      console.log(`Authorized consumer contract: ${functionManager.address}`);
    }

    const subInfo = await registry.getSubscription(subscriptionId);
    console.log(`\nCreated subscription with ID: ${subscriptionId}`);
    console.log(`Owner: ${subInfo[1]}`);
    console.log(`Balance: ${ethers.utils.formatEther(subInfo[0])} LINK`);
    console.log(
      `${subInfo[2].length} authorized consumer contract${
        subInfo[2].length === 1 ? "" : "s"
      }:`
    );
    console.log(subInfo[2]);
  });
