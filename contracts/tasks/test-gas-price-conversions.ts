import { task, types } from "hardhat/config";

task("gas-price-tests", "approve arbitrary address to transfer LINK")
  .addParam(
    "contractaddr",
    "The address to approve transfers to",
    undefined,
    types.string
  )
  .setAction(async (taskArgs, { ethers }) => {
    if (!taskArgs.contractaddr) {
      throw new Error("--contractaddr must be specified");
    }
    const functionsManager = await ethers.getContractAt(
      "FunctionsManager",
      taskArgs.contractaddr
    );

    console.log("Gas price: ", await functionsManager.getGasPrice());

    console.log("Gas to Gwei: ", await functionsManager.gasToGwei());
    console.log("Gas to LinkToken: ", await functionsManager.gasToLinkToken());
    console.log(
      "Latest Link Price: ",
      await functionsManager.getLatestLinkPrice()
    );
    console.log(
      "Latest Link Price Timestamp: ",
      await functionsManager.getLatestLinkPriceTimestamp()
    );
  });
