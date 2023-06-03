import { ethers } from "hardhat";
import { networks } from "../hardhat.config";

async function main() {
  const [signer] = await ethers.getSigners();
  const WebappSnippet = await ethers.getContractFactory("WebappSnippet");
  const functionsManagerAddr = "0x3D5b76E593749A3CD8Dc8B1EE9A4e0725dFD36D6";
  const linkTokenAddr = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
  console.log("Signer address: ", signer.address);

  const webappSnippet = await WebappSnippet.deploy(
    functionsManagerAddr,
    linkTokenAddr
  );
  await webappSnippet.deployed();

  const linkToken = await ethers.getContractAt(
    "LinkToken",
    linkTokenAddr,
    signer
  );
  console.log(`Deployed WebappSnippet contract to ${webappSnippet.address}`);

  const approveTx = await linkToken.approve(
    webappSnippet.address,
    ethers.utils.parseEther("10")
  );
  const approveTx2 = await linkToken.approve(
    functionsManagerAddr,
    ethers.utils.parseEther("10")
  );
  // Wait for LINK approval
  await approveTx.wait(1);
  await approveTx2.wait(1);
  const sendTx = await webappSnippet.sendRequest({ gasLimit: 1_000_000 });
  const sendReceipt = await sendTx.wait(1);
  console.log("sendReceipt", sendReceipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
