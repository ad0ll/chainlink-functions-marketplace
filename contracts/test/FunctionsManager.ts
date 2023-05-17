import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("FunctionsManager", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFunctionsManager() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const FunctionsManager = await ethers.getContractFactory(
      "FunctionsManager"
    );
    const oracle = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
    const linkAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
    const billingRegistry = "0x3c79f56407DCB9dc9b852D139a317246f43750Cc";
    const functionsManager = await FunctionsManager.deploy(
      linkAddress,
      billingRegistry,
      oracle,
      ethers.utils.parseEther("0.2"),
      5,
      ethers.utils.parseEther("3")
    );

    return { functionsManager, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { functionsManager } = await loadFixture(deployFunctionsManager);

      expect(functionsManager);
    });
  });

  describe("Register", function () {
    describe("Events", function () {
      it("Should emit an event on register function", async function () {
        const { functionsManager, owner } = await loadFixture(
          deployFunctionsManager
        );

        const fees = "1000000000000000000";
        const subId = 1;
        const functionName = "test";
        const desc = "test desc";
        const imageUrl = "https://image.url";
        const source = "https://source.url";
        const secrets = ethers.utils.defaultAbiCoder.encode(
          ["bytes"],
          [["https://secrets.url"]]
        );
        const expectedArgs: string[] = ["arg1", "arg2", "arg3"];
        const category = ethers.utils.formatBytes32String("test");

        await expect(
          functionsManager.registerFunction({
            fees,
            functionName,
            desc,
            imageUrl,
            codeLocation: 1,
            secretsLocation: 1,
            language: 0,
            source,
            secrets,
            expectedArgs,
            category,
            subId,
          })
        )
          .to.emit(functionsManager, "FunctionRegistered")
          .withArgs({
            fees,
            owner: owner.address,
            subId,
            functionName,
            desc,
            imageUrl,
            request: {
              codeLocation: 1,
              secretsLocation: 1,
              language: 1,
              source,
              secrets,
              expectedArgs,
            },
          });
      });
    });
  });

  describe("Execute Request", function () {
    it("Should send request and generate request Id", async function () {});
  });

  describe("Fulfill Request", function () {
    it("Should emit an event on register function", async function () {});
  });
});
