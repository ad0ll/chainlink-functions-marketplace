import { ethers } from 'hardhat'
import { networks } from '../hardhat.config'

async function main() {
  const FunctionsManager = await ethers.getContractFactory('FunctionsManager')

  const linkAddress = networks.polygonMumbai.linkToken
  const billingRegistry = networks.polygonMumbai.functionsBillingRegistryProxy
  const oracle = networks.polygonMumbai.functionsOracleProxy
  const functionsManager = await FunctionsManager.deploy(
    linkAddress,
    billingRegistry,
    oracle,
    ethers.utils.parseEther('0.2'),
    5,
    ethers.utils.parseEther('3')
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
