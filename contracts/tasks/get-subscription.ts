import { task, types } from "hardhat/config";

task("get-subscription", "gets subscription")
  .addOptionalParam(
    "billingregistry",
    "The address of the FunctionsBillingRegistry",
    undefined,
    types.string
  )
  .addOptionalParam(
    "subscriptionid",
    "The id of the subscription to retrieve",
    undefined,
    types.string
  )
  .addOptionalParam(
    "checkauth",
    "An address to check if is authorized to use the subscription",
    undefined,
    types.string
  )
  .setAction(async (taskArgs, { ethers }) => {
    if (!taskArgs.billingregistry) {
      throw new Error("--functionmanager must be specified");
    }
    if (!taskArgs.subscriptionid) {
      throw new Error("--subscriptionid must be specified");
    }

    const [signer] = await ethers.getSigners();
    const billingRegistryRaw = await ethers.getContractAt(
      "FunctionsBillingRegistry",
      taskArgs.billingregistry
    );
    const billingRegistry = billingRegistryRaw.connect(signer);

    console.log(
      "Getting subscription for subscriptionid: ",
      taskArgs.subscriptionid
    );
    const metadata = await billingRegistry.getSubscription(
      taskArgs.subscriptionid
    );

    console.log(metadata)
    if(taskArgs.checkauth) {
      console.log(
        "Checking if address is authorized to use subscription: ",
        taskArgs.checkauth
      );
      metadata.consumers.forEach((consumer) => {
        if(consumer === taskArgs.checkauth) {
          console.log("Address is authorized")
          return;
        }
      })
    }
  });
