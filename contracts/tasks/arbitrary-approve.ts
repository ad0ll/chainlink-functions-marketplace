import { task, types } from "hardhat/config";

task("arbitrary-approve", "approve arbitrary address to transfer LINK")
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
    const linkToken = await ethers.getContractAt(
      "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol:LinkTokenInterface",
      "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
    );
    const tx = await linkToken.approve(
      taskArgs.contractaddr,
      ethers.utils.parseEther("10000")
    );
    const receipt = await tx.wait();
    console.log(receipt);
  });
