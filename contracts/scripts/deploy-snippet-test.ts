import { ethers } from "hardhat";
import { networks } from "../hardhat.config";

async function main() {
  const WebappSnippet = await ethers.getContractFactory("WebappSnippet");

  const webappSnippet = await WebappSnippet.deploy();


  const linkAddress = networks.polygonMumbai.linkToken;
  const billingRegistry = networks.polygonMumbai.functionsBillingRegistryProxy;
  const oracle = networks.polygonMumbai.functionsOracleProxy;
  const functionsManager = await FunctionsManager.deploy(
    linkAddress,
    billingRegistry,
    oracle,
    // ethers.utils.parseEther("0.2"),
    5,
    ethers.utils.parseEther("0.5"),
    300_000 //Gas limit, leave at 300_000.
  );

  await functionsManager.deployed();

  console.log(
    `Deployed FunctionsManager contract to ${functionsManager.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
