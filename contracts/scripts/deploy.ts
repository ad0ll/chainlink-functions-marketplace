import { ethers } from 'hardhat'

async function main() {
  const FunctionsManager = await ethers.getContractFactory('FunctionsManager')
  const linkAddress = '0x779877A7B0D9E8603169DdbD7836e478b4624789'
  const billingRegistry = '0x3c79f56407DCB9dc9b852D139a317246f43750Cc'
  const oracle = '0x649a2C205BE7A3d5e99206CEEFF30c794f0E31EC'
  const functionsManager = await FunctionsManager.deploy(
    linkAddress,
    billingRegistry,
    oracle
  )

  await functionsManager.deployed()

  console.log(
    `Deployed FunctionsManager contract to ${functionsManager.address}`
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
