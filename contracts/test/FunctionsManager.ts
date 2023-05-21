import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import fs, { link } from "fs";
import { FakeContract, smock } from "@defi-wonderland/smock";
import { any } from "hardhat/internal/core/params/argumentTypes";
import { parseEther } from "ethers/lib/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("FunctionsManager", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFunctionsManager() {
    // Contracts are deployed using the first signer/account by default
    const [linkTokenOwner, functionsManagerOwner, otherAccount, external3] =
      await ethers.getSigners();
    // console.log("signers", await ethers.getSigners());
    const LinkToken = await ethers.getContractFactory(
      "MockLinkToken",
      linkTokenOwner
    );
    const linkToken = await LinkToken.deploy();
    await linkToken.deployed();

    const BillingRegistry = await ethers.getContractFactory(
      "MockBillingRegistry",
      linkTokenOwner
    );
    const billingRegistry = await BillingRegistry.deploy();
    await billingRegistry.deployed();

    const FunctionsOracle = await ethers.getContractFactory(
      "MockFunctionsOracle",
      linkTokenOwner
    );
    const functionsOracle = await FunctionsOracle.deploy();
    await functionsOracle.deployed();
    await functionsOracle.setRegistry(billingRegistry.address);

    const FunctionsManager = await ethers.getContractFactory(
      "FunctionsManager",
      functionsManagerOwner
    );

    console.log("linkToken.address", linkToken.address);
    console.log("billingRegistry.address", billingRegistry.address);
    console.log("functionsOracle.address", functionsOracle.address);
    const functionsManager = await FunctionsManager.deploy(
      linkToken.address,
      billingRegistry.address,
      functionsOracle.address,
      ethers.utils.parseEther("0.2"),
      5,
      ethers.utils.parseEther("3")
    );

    await functionsManager.deployed();
    await billingRegistry.setFunctionsManager(functionsManager.address);

    console.log("functionsManager.address", functionsManager.address);
    console.log("otherAccount.address", otherAccount.address);
    return {
      functionsManager,
      billingRegistry,
      linkTokenOwner,
      functionsManagerOwner,
      otherAccount,
    };
  }

  // Function Metadata
  const request = {
    fees: ethers.utils.parseEther("0.002"),
    functionName: "Test Function 3",
    desc: "Test description",
    imageUrl: "https://image.url/",
    expectedArgs: ["principalAmount", "APYTimes100"],
    codeLocation: 0,
    secretsLocation: 0,
    language: 0,
    subId: 0,
    source: fs.readFileSync("./calculation-example.js").toString(),
    secrets: [],
    category: ethers.utils.formatBytes32String("calculations"),
  };
  const executeDemoRequest = async (
    functionsManager: any,
    functionId: string
  ) => {
    console.log("Calling executeRequest with functionId", functionId);

    const tx = await functionsManager.executeRequest(
      functionId,
      ["10000", "450"],
      30000
    );
    const receipt = await tx.wait();
    console.log("Finished calling executeRequest");
    const executeRequestEvent = receipt.events?.find(
      (e) => e.event === "FunctionCalled"
    );
    expect(executeRequestEvent);

    const requestId = executeRequestEvent?.args?.["requestId"].toString();
    expect(requestId);
    console.log("requestId", requestId);

    console.log("Getting function post execute to see if sub hit ");
    const f = await functionsManager.getFunction(functionId);
    expect(f?.subId);
    expect(f?.lockedProfitPool).equal(request.fees.mul(95).div(100));

    return { ev: executeRequestEvent, requestId, functionId, func: f };
  };

  const fulfillDemoRequest = async (
    functionsManager: any,
    billingRegistry: any,
    functionsManagerOwner: SignerWithAddress,
    requestId: string
  ) => {
    const functionsManagerOwnerCaller = await functionsManager.connect(
      functionsManagerOwner
    );
    //TODO not sure if you have to actually be the function manager owner
    // const fulfill = await functionsManagerOwnerCaller.handleOracleFulfillment(
    //   requestId,
    //   Buffer.from("response"),
    //   Buffer.from("")
    // );
    const billingRegistryOwnerCaller = await billingRegistry.connect(
      functionsManagerOwner
    );
    const fulfill = await billingRegistryOwnerCaller.fulfillAndBill(
      requestId,
      Buffer.from("response"),
      Buffer.from("")
    );
    const fulfillReceipt = await fulfill.wait();
    const fulfillEvent = fulfillReceipt.events?.find(
      (e: any) => e.event === "FunctionCallCompleted"
    );
    expect(fulfillEvent);

    // console.log(fulfillReceipt);
    const billingLog = fulfillReceipt.events?.find(
      (e) => e.event === "FulfillAndBillLog"
    );
    expect(billingLog);

    return { fulfillReceipt, fulfillEvent, billingLog };
  };

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { functionsManager } = await loadFixture(deployFunctionsManager);
      expect(functionsManager);
    });
  });

  describe("Register", function () {
    describe("Events", function () {
      it("Should emit an event on register function", async function () {
        const { functionsManager, otherAccount } = await loadFixture(
          deployFunctionsManager
        );

        await expect(functionsManager.registerFunction(request)).to.emit(
          functionsManager,
          "FunctionRegistered"
        );
        // .withArgs(
        //   <who knows the function id>,
        //   otherAccount.address,
        //   ethers.utils.formatBytes32String("calculations"),
        //   request
        // );
      });
    });
  });

  describe("Execute Request", function () {
    it("Should send request and generate request Id", async function () {
      const {
        functionsManagerOwner,
        functionsManager: rawFunctionsManager,
        otherAccount,
        // sub1,
        billingRegistry,
      } = await loadFixture(deployFunctionsManager);

      const functionsManager = await rawFunctionsManager.connect(otherAccount);
      console.log(
        "Calling registerFunction as otherAccount: ",
        otherAccount.address
      );

      let tx = await functionsManager.registerFunction(request);
      let receipt = await tx.wait();
      console.log("Finished calling registerFunction");

      const functionRegisteredEvent = receipt.events?.find(
        (e) => e.event === "FunctionRegistered"
      );
      expect(functionRegisteredEvent);

      const functionId =
        functionRegisteredEvent?.args?.["functionId"].toString();
      expect(functionId);
      const fPreExecute = await functionsManager.getFunction(functionId);
      expect(fPreExecute.name).equal(request.functionName);
      expect(fPreExecute.fee).equal(request.fees);

      const func = await functionsManager.getFunction(functionId);
      expect(func?.subId);
      const asFmBillingRegistry = await billingRegistry.connect(
        functionsManagerOwner
      );
      console.log("Forcing balance");
      await asFmBillingRegistry.forceBalance(func.subId, parseEther("10"));

      const { requestId } = await executeDemoRequest(
        functionsManager,
        functionId
      );

      console.log("Getting subscription balance 3");
      const s3 = await functionsManager.getSubscriptionBalance(func.subId);
      expect(s3).equal(parseEther("0.2"));

      // TODO Move below into a proper test, move above into a fixture
      console.log("Fulfulling subscription");
      const { fulfillEvent } = await fulfillDemoRequest(
        functionsManager,
        billingRegistry,
        functionsManagerOwner,
        requestId
      );
      expect(fulfillEvent);

      console.log("fulfillEvent", fulfillEvent);
      const fPostFulfill = await functionsManager.getFunction(functionId);
      expect(fPostFulfill?.lockedProfitPool).equal(parseEther("0"));
      expect(fPostFulfill?.unlockedProfitPool).equal(
        request.fees.mul(95).div(100)
      );

      // //TODO move this into a proper test (checking the refill behavior)
      const { requestId: dropRequestId } = await executeDemoRequest(
        functionsManager,
        functionId
      );
      billingRegistry.forceBalance(func.subId, parseEther("0.8")); //Below the 1 LINK minimum

      console.log("Getting subscription balance 4");
      const s4 = await functionsManager.getSubscriptionBalance(func.subId);
      expect(s4).equal(parseEther("0.4"));

      const { fulfillEvent: fulfillEventWithRefill } = await fulfillDemoRequest(
        functionsManager,
        billingRegistry,
        functionsManagerOwner,
        dropRequestId
      );
      const s2 = await functionsManager.getSubscriptionBalance(func?.subId);
      expect(s2).equal(parseEther("0"));
      // const aS = await billingRegistry.getSubscription(func?.subId);
      // expect(aS?.balance).equal(parseEther("0.4"));

      const st = await functionsManager.getFunctionResponse(dropRequestId);
      console.log("functionResponse", st);
      
      // console.log("fulfillEvent", fulfillEventWithRefill.args);
    });
  });

  describe("Fulfill Request", function () {
    it("Should emit an event on register function", async function () {});
  });
});
