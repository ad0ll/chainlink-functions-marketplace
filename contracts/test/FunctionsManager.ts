import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('FunctionsManager', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFunctionsManager() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners()

    const FunctionsManager = await ethers.getContractFactory('FunctionsManager')
    const oracle = '0x779877A7B0D9E8603169DdbD7836e478b4624789'
    const linkAddress = '0x779877A7B0D9E8603169DdbD7836e478b4624789'
    const billingRegistry = '0x3c79f56407DCB9dc9b852D139a317246f43750Cc'
    const functionsManager = await FunctionsManager.deploy(
      linkAddress,
      billingRegistry,
      oracle
    )

    return { functionsManager, owner, otherAccount }
  }

  describe('Deployment', function () {
    it('Should deploy successfully', async function () {
      const { functionsManager } = await loadFixture(deployFunctionsManager)

      expect(functionsManager)
    })
  })

  describe('Register', function () {
    describe('Events', function () {
      it('Should emit an event on register function', async function () {
        const { functionsManager, owner } = await loadFixture(
          deployFunctionsManager
        )

        const proxyAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
        const fees = '1000000000000000000'
        const subId = 1
        const functionName = 'test'
        const desc = 'test desc'
        const imageUrl = 'https://image.url'
        const source = 'https://source.url'
        const secrets = ethers.utils.defaultAbiCoder.encode(
          ['bytes'],
          [['https://secrets.url']]
        )
        const args: string[] = ['arg1', 'arg2', 'arg3']

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
            args,
          })
        )
          .to.emit(functionsManager, 'FunctionRegistered')
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
              args,
            },
          })
      })
    })
  })

  describe('Execute Request', function () {
    it('Should send request and generate request Id', async function () {})
  })

  describe('Fulfill Request', function () {
    it('Should emit an event on register function', async function () {})
  })
})
