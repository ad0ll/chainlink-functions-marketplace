/*
This contract is used in mocks and tests where we need to mint LINK on the hardhat network
*/
// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;

// Having this let's us use hardhat.ethers.getContractAt/Factory("LinkToken") in scripts and tasks
import "@chainlink/contracts/src/v0.4/LinkToken.sol";
