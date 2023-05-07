import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
// import hre from "hardhat";
import { BigNumber } from "ethers";
import { formatBytes32String } from "ethers/lib/utils";
import { fileURLToPath } from "url";
const IERC20_SOURCE = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";
const LINK_SOURCE = "@chainlink/contracts/src/v0.4/LinkToken.sol";
const LINK_WHALE = "0x514910771af9ca656af840dff83e8264ecf986ca";
const LINK_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const ONE_LINK = BigNumber.from(10).pow(18);
describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  //
  // Gives you a FeeManager instance and an account that has 1000 LINK tokens
  async function deployFeeManagerFixture() {
    // Deploy LinkToken contract and mint 1000 LINK tokents to the owner
    const [owner, external1, external2, external3] = await ethers.getSigners();
    const LinkToken = await ethers.getContractFactory("LinkToken");
    const linkToken = await LinkToken.deploy();
    await linkToken.deployed();
    // const totalSupply = await linkToken.totalSupply();
    // const ownerBalance = await linkToken.balanceOf(owner.address);
    // console.log("totalSupply", totalSupply.toString());
    // console.log("ownerBalance", ownerBalance.toString());
    // console.log("token.address", linkToken.address);

    const FeeManager = await ethers.getContractFactory("FeeManager");
    const baseFee = ONE_LINK.div(5);
    const feeManager = await FeeManager.deploy(linkToken.address, baseFee, 5);
    return { linkToken, owner, feeManager, external1, external2, external3 };
  }

  async function registerFunctionFixture() {
    const { linkToken, feeManager, owner, external1, external2 } =
      await loadFixture(deployFeeManagerFixture);

    const feeManagerWithRegisteringUser = feeManager.connect(external1);
    const registerTransaction =
      await feeManagerWithRegisteringUser.registerFunction(
        external2.address,
        formatBytes32String("test"),
        formatBytes32String("callbackName"),
        BigNumber.from(ONE_LINK.div(10))
      );
    const receipt = await registerTransaction.wait();
    const event = receipt.events?.find((e) => e.event === "FunctionRegistered");
    expect(event).to.not.be.undefined;
    expect(event?.args?.proxyAddress).to.equal(external2.address);
    expect(event?.args?.functionName).to.equal(formatBytes32String("test"));
    expect(event?.args?.fee).to.equal(ONE_LINK.div(10));

    const getFunctionTransaction = await feeManager.getFunction(
      external2.address
    );
    // const getFunctionReceipt = await getFunctionTransaction.wait();
    // console.log(getFunctionReceipt);
    return {
      linkToken,
      feeManager,
      owner,
      functionOwner: external1,
      functionAddress: external2,
      functionRegisteredEvent: event,
      func: getFunctionTransaction,
    };
  }


  const callFunction = async (proxyContract, callbackFunction, deposit) => {
    const { linkToken, feeManager, owner, external1, external2 } =
      await loadFixture(deployFeeManagerFixture);

    const feeManagerWithRegisteringUser = feeManager.connect(external1);
    const registerTransaction =
      await feeManagerWithRegisteringUser.registerFunction(
        external2.address,
        formatBytes32String("test"),
        formatBytes32String("callbackName"),
        BigNumber.from(ONE_LINK.div(10))
      );
    const receipt = await registerTransaction.wait();
    const event = receipt.events?.find((e) => e.event === "FunctionRegistered");
    expect(event).to.not.be.undefined;
    expect(event?.args?.proxyAddress).to.equal(external2.address);
    expect(event?.args?.functionName).to.equal(formatBytes32String("test"));
    expect(event?.args?.fee).to.equal(ONE_LINK.div(10));

    const getFunctionTransaction = await feeManager.getFunction(
      external2.address
    );
    // const getFunctionReceipt = await getFunctionTransaction.wait();
    // console.log(getFunctionReceipt);
    return {
      linkToken,
      feeManager,
      owner,
      functionOwner: external1,
      functionAddress: external2,
      functionRegisteredEvent: event,
      func: getFunctionTransaction,
    };
  }

  describe("Deployment", function () {
    it("Should set the right variables", async function () {
      const { linkToken, feeManager, owner } = await loadFixture(
        deployFeeManagerFixture
      );
      expect(await linkToken.balanceOf(owner.address)).to.equal(
        ONE_LINK.mul(1000000000)
      );
      expect(await feeManager.linkAddress()).to.equal(linkToken.address);
      expect(await feeManager.baseFee()).to.equal(ONE_LINK.div(5));
      expect(await feeManager.feeManagerCut()).to.equal(5);
    });

    describe("function registration", () => {
      it("Should register a function", async function () {
        const {
          linkToken,
          feeManager,
          owner,
          func,
          functionOwner,
          functionAddress,
        } = await loadFixture(registerFunctionFixture);
        expect(owner.address).to.not.be.equal(functionOwner.address);
        expect(func.owner).to.be.equal(functionOwner.address);
        expect(func.proxyAddress).to.be.equal(functionAddress.address);
        expect(func.functionName).to.be.equal(formatBytes32String("test"));
        expect(func.fee).to.be.equal(ONE_LINK.div(10));
      });
    });
    describe("function execution", () => {

    });

    describe("callback execution", () => {});
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
