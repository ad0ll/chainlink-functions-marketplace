import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
// import hre from "hardhat";
import { BigNumber } from "ethers";
import { formatBytes32String } from "ethers/lib/utils";
import { fileURLToPath } from "url";
import { FeeManager } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
const IERC20_SOURCE = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";
const LINK_SOURCE = "@chainlink/contracts/src/v0.4/LinkToken.sol";
const LINK_WHALE = "0x514910771af9ca656af840dff83e8264ecf986ca";
const LINK_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const ONE_LINK = BigNumber.from(10).pow(18);

const callFunction = async (
  feeManager: FeeManager,
  caller: SignerWithAddress,
  proxyAddress: string,
  callback: string
) => {
  const feeManagerWithCaller = feeManager.connect(caller);
  const callFunctionTransaction = await feeManagerWithCaller.callFunction(
    proxyAddress,
    formatBytes32String(callback)
  );
  const receipt = await callFunctionTransaction.wait();

  const event = receipt.events?.find((e) => e.event === "FunctionCalled");
  const requestId = event?.args?.requestId;
  return { receipt, requestId };
};

const getResponse = async (feeManager: FeeManager, requestId: string) => {
  const response = await feeManager.getFunctionResponse(requestId);
  return response;
};

describe("FeeManager", function () {
  // Gives you a FeeManager instance and an account that has 1000 LINK tokens
  async function deployFeeManagerFixture() {
    // Deploy LinkToken contract and mint 1000 LINK tokents to the owner
    const [owner, external1, external2, external3] = await ethers.getSigners();
    const LinkToken = await ethers.getContractFactory("LinkToken");
    const linkToken = await LinkToken.deploy();
    await linkToken.deployed();

    const FeeManager = await ethers.getContractFactory("FeeManager");
    const FeeManagerCaller = await FeeManager.connect(owner);
    const baseFee = ONE_LINK.div(5);
    const feeManager = await FeeManagerCaller.deploy(
      linkToken.address,
      baseFee,
      5
    );

    const transferExternal = await linkToken.transfer(
      external3.address,
      ONE_LINK.mul(100)
    );
    await transferExternal.wait();

    // Approve LinkToken contract to spend 1000 LINK tokens
    const linkTokenCaller = await linkToken.connect(owner.address);
    linkToken.approve(feeManager.address, ONE_LINK.mul(1000));

    return { linkToken, owner, feeManager, external1, external2, external3 };
  }

  async function registerFunctionFixture() {
    const {
      linkToken,
      feeManager,
      external1,
      external2,
      external3,
      ...deployVals
    } = await loadFixture(deployFeeManagerFixture);

    const proxyContract = await ethers.Wallet.createRandom();
    const feeManagerWithRegisteringUser = feeManager.connect(external1);
    const registerTransaction =
      await feeManagerWithRegisteringUser.registerFunction(
        proxyContract.address,
        "test function name",
        "test function description many words",
        BigNumber.from(ONE_LINK.div(10))
      );
    const receipt = await registerTransaction.wait();

    // const getFunctionReceipt = await getFunctionTransaction.wait();
    // console.log(getFunctionReceipt);
    return {
      ...deployVals,
      linkToken,
      feeManager,
      receipt,
      owner: external1,
      external2,
      external3,
      proxyAddress: proxyContract.address,
    };
  }

  describe("Deployment", function () {
    it("Should set the right variables", async function () {
      const { linkToken, feeManager, owner } = await loadFixture(
        deployFeeManagerFixture
      );
      //   expect(await linkToken.balanceOf(owner.address)).to.equal(
      //     ONE_LINK.mul(1000000000)
      //   );
      expect(await feeManager.linkAddress()).to.equal(linkToken.address);
      expect(await feeManager.baseFee()).to.equal(ONE_LINK.div(5));
      expect(await feeManager.feeManagerCut()).to.equal(5);
    });

    describe("function registration", () => {
      it("Should register a function", async function () {
        const { feeManager, owner, receipt, proxyAddress } = await loadFixture(
          registerFunctionFixture
        );
        const event = receipt.events?.find(
          (e) => e.event === "FunctionRegistered"
        );
        expect(event).to.not.be.undefined;
        expect(event?.args).to.not.be.undefined;
        expect(event?.args?.proxyAddress).to.equal(proxyAddress);
        expect(event?.args?.owner).to.be.equal(owner.address);
        expect(event?.args?.metadata).to.not.be.undefined;
        expect(event?.args?.metadata.name).to.equal("test function name");
        expect(event?.args?.metadata.description).to.equal(
          "test function description many words"
        );
        expect(event?.args?.metadata.imageUrl).to.equal("");
        expect(event?.args?.metadata.subId).to.equal(0);
        expect(event?.args?.metadata.fee).to.equal(ONE_LINK.div(10));
        expect(event?.args?.metadata.subscriptionPool).to.equal(0);
        expect(event?.args?.metadata.lockedProfitPool).to.equal(0);
        expect(event?.args?.metadata.unlockedProfitPool).to.equal(0);
        expect(event?.args?.metadata.fee).to.equal(ONE_LINK.div(10));

        // Test the function by getting it
        const getFunctionTransaction = await feeManager.getFunction(
          proxyAddress
        );
        expect(getFunctionTransaction).to.not.be.undefined;
        expect(getFunctionTransaction.owner).to.be.equal(owner.address);
        expect(getFunctionTransaction.subId).to.be.equal(0);
        expect(getFunctionTransaction.name).to.be.equal("test function name");
        expect(getFunctionTransaction.description).to.be.equal(
          "test function description many words"
        );
        expect(getFunctionTransaction.imageUrl).to.be.equal("");
        expect(getFunctionTransaction.fee).to.be.equal(ONE_LINK.div(10));
        expect(getFunctionTransaction.subscriptionPool).to.be.equal(0);
        expect(getFunctionTransaction.lockedProfitPool).to.be.equal(0);
        expect(getFunctionTransaction.unlockedProfitPool).to.be.equal(0);
      });
    });

    describe("function execution", () => {
      it("Should execute a function", async function () {
        const { linkToken, feeManager, owner, external3, proxyAddress } =
          await loadFixture(registerFunctionFixture);

        const fee = ONE_LINK.div(10);
        const managerCut = fee.mul(5).div(100);
        console.log("external3", external3.address);

        const linkkTokenCaller = linkToken.connect(external3);
        const approveTransaction = await linkkTokenCaller.approve(
          feeManager.address,
          ONE_LINK.mul(100)
        );

        const feeManagerCaller = feeManager.connect(external3);
        const { receipt: callReceipt, requestId } = await callFunction(
          feeManagerCaller,
          external3,
          proxyAddress,
          "callbackFunction"
        );
        // console.log(callReceipt);

        const event = callReceipt.events?.find(
          (e) => e.event === "FunctionCalled"
        );
        expect(event).to.not.be.undefined;
        expect(event?.args).to.not.be.undefined;
        expect(event?.args?.proxyAddress).to.equal(proxyAddress);
        expect(event?.args?.caller).to.be.equal(external3.address);
        expect(event?.args?.requestId).to.not.be.undefined;
        expect(event?.args?.requestId).to.equal(requestId);
        expect(event?.args?.owner).to.equal(owner.address);
        expect(event?.args?.callbackFunction).to.equal(
          formatBytes32String("callbackFunction")
        );
        expect(event?.args?.baseFee).to.equal(ONE_LINK.div(5));
        expect(event?.args?.fee).to.equal(fee);

        const feeManagerProfitPool = await feeManager.feeManagerProfitPool();
        expect(feeManagerProfitPool).to.equal(managerCut);

        const func = await feeManager.getFunction(proxyAddress);
        expect(func.lockedProfitPool).to.equal(fee.sub(managerCut));
        expect(func.unlockedProfitPool).to.equal(0);

        const linkBalance = await linkToken.balanceOf(external3.address);
        expect(linkBalance).to.equal(ONE_LINK.mul(100).sub(fee));
        console.log("callRequestId: ", requestId);
      });
    });

    describe("callback execution", () => {
      it("Should execute a callback", async function () {
        const { linkToken, feeManager, owner, external3, proxyAddress } =
          await loadFixture(registerFunctionFixture);

        const fee = ONE_LINK.div(10);
        const managerCut = fee.mul(5).div(100);
        console.log("external3", external3.address);

        const linkkTokenCaller = linkToken.connect(external3);
        const approveTransaction = await linkkTokenCaller.approve(
          feeManager.address,
          ONE_LINK.mul(100)
        );

        const feeManagerCaller = feeManager.connect(external3);
        const { receipt: callReceipt, requestId } = await callFunction(
          feeManagerCaller,
          external3,
          proxyAddress,
          "callbackFunction"
        );

        
      });
    });
  });

  //   describe("Withdrawals", function () {
  //     describe("Validations", function () {
  //       it("Should revert with the right error if called too soon", async function () {
  //         const { lock } = await loadFixture(deployOneYearLockFixture);

  //         await expect(lock.withdraw()).to.be.revertedWith(
  //           "You can't withdraw yet"
  //         );
  //       });

  //       it("Should revert with the right error if called from another account", async function () {
  //         const { lock, unlockTime, otherAccount } = await loadFixture(
  //           deployOneYearLockFixture
  //         );

  //         // We can increase the time in Hardhat Network
  //         await time.increaseTo(unlockTime);

  //         // We use lock.connect() to send a transaction from another account
  //         await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //           "You aren't the owner"
  //         );
  //       });

  //       it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //         const { lock, unlockTime } = await loadFixture(
  //           deployOneYearLockFixture
  //         );

  //         // Transactions are sent using the first signer by default
  //         await time.increaseTo(unlockTime);

  //         await expect(lock.withdraw()).not.to.be.reverted;
  //       });
  //     });

  //     describe("Events", function () {
  //       it("Should emit an event on withdrawals", async function () {
  //         const { lock, unlockTime, lockedAmount } = await loadFixture(
  //           deployOneYearLockFixture
  //         );

  //         await time.increaseTo(unlockTime);

  //         await expect(lock.withdraw())
  //           .to.emit(lock, "Withdrawal")
  //           .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //       });
  //     });

  //     describe("Transfers", function () {
  //       it("Should transfer the funds to the owner", async function () {
  //         const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //           deployOneYearLockFixture
  //         );

  //         await time.increaseTo(unlockTime);

  //         await expect(lock.withdraw()).to.changeEtherBalances(
  //           [owner, lock],
  //           [lockedAmount, -lockedAmount]
  //         );
  //       });
  //     });
  //   });
});
