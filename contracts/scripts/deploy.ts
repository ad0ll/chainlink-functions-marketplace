import { BigNumber } from "ethers";
import { ethers } from "hardhat";

async function main() {
  const FunctionsManager = await ethers.getContractFactory("FunctionsManager");

  // BELOW IS SEPOLIA
  // const linkAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
  // const billingRegistry = "0x3c79f56407DCB9dc9b852D139a317246f43750Cc";
  // const oracle = "0x649a2C205BE7A3d5e99206CEEFF30c794f0E31EC";

  // BELOW IS MUMBAI
  const linkAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
  const billingRegistry = "0xEe9Bf52E5Ea228404bB54BCFbbDa8c21131b9039";
  const oracle = "0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4";

  const functionsManager = await FunctionsManager.deploy(
    linkAddress,
    billingRegistry,
    oracle,
    BigNumber.from("1000000000000000000").div(5), //0.2 LINK
    5, //fee manager cut
    BigNumber.from("1000000000000000000") //Minimum subscription deposit
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
