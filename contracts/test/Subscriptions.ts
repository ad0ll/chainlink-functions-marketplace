// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { expect } from "chai";
// import { ethers } from "hardhat";
// import fs from "fs";

// describe("FunctionsManager", function () {
//   // We define a fixture to reuse the same setup in every test.
//   // We use loadFixture to run this setup once, snapshot that state,
//   // and reset Hardhat Network to that snapshot in every test.
//   async function deployFunctionsManager() {
//     // Contracts are deployed using the first signer/account by default
//     const [owner, otherAccount] = await ethers.getSigners();

//     const FunctionsManager = await ethers.getContractFactory(
//       "FunctionsManager"
//     );

//     const orga
//     const oracle = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
//     const linkAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
//     const billingRegistry = "0x3c79f56407DCB9dc9b852D139a317246f43750Cc";
//     const functionsManager = await FunctionsManager.deploy(
//       linkAddress,
//       billingRegistry,
//       oracle,
//       ethers.utils.parseEther("0.2"),
//       5,
//       ethers.utils.parseEther("3")
//     );

//     return { functionsManager, owner, otherAccount };
//   }

//   // Function Metadata
//   const request = {
//     fees: ethers.utils.parseEther("0.002"),
//     functionName: "Test Function 3",
//     desc: "Test description",
//     imageUrl: "https://image.url/",
//     expectedArgs: ["principalAmount", "APYTimes100"],
//     codeLocation: 0,
//     secretsLocation: 0,
//     language: 0,
//     subId: Number(950),
//     source: fs.readFileSync("./calculation-example.js").toString(),
//     secrets: [],
//     category: ethers.utils.formatBytes32String("calculations"),
//   };

//   describe("Deployment", function () {
//     it("Should deploy successfully", async function () {
//       const { functionsManager } = await loadFixture(deployFunctionsManager);

//       expect(functionsManager);
//     });
//   });

//   describe("Register", function () {
//     describe("Events", function () {
//       it("Should emit an event on register function", async function () {
//         const { functionsManager, owner } = await loadFixture(
//           deployFunctionsManager
//         );

//         await expect(functionsManager.registerFunction(request))
//           .to.emit(functionsManager, "FunctionRegistered")
//           .withArgs(
//             "0xa9382ed06ebf2dbd7ca4ffacb8cf66cf3486282a47ca999ec5c4d3255d6cad2f",
//             owner.address,
//             ethers.utils.formatBytes32String("calculations"),
//             request
//           );
//       });
//     });
//   });

//   describe("Execute Request", function () {
//     it("Should send request and generate request Id", async function () {
//       const { functionsManager, owner } = await loadFixture(
//         deployFunctionsManager
//       );

//       let tx = await functionsManager.registerFunction(request);
//       let receipt = await tx.wait();

//       if (receipt.events && receipt.events[0] && receipt.events[0].args) {
//         const functionId = receipt.events[0].args["functionId"].toString();
//         tx = await functionsManager.executeRequest(
//           functionId,
//           ["10000", "450"],
//           30000
//         );
//         receipt = await tx.wait();
//         if (receipt.events && receipt.events[0] && receipt.events[0].args) {
//           const requestId = receipt.events[0].args["requestId"].toString();
//           expect(requestId);
//         }
//       }
//     });
//   });

//   describe("Fulfill Request", function () {
//     it("Should emit an event on register function", async function () {});
//   });
// });
