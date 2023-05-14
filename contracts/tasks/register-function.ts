import { task, types } from 'hardhat/config'
import fs from 'fs'

task('register-function', 'registers a function')
  .addOptionalParam(
    'functionsmanager',
    'The address of the functions manager',
    undefined,
    types.string
  )
  .addOptionalParam(
    'subscriptiondeposit',
    'Amount of LINK to fund subscription with',
    '3000000000000000000',
    types.string
  )
  .addOptionalParam(
    'gaslimit',
    'Maximum amount of gas that can be used to call fulfillRequest in the client contract',
    100000,
    types.int
  )
  .setAction(async (taskArgs, { ethers }) => {
    if (!taskArgs.functionsmanager) {
      throw new Error('--functionmanager must be specified')
    }

    if (taskArgs.gaslimit > 20000000) {
      throw new Error('--gaslimit must be less than or equal to 300,000')
    }
    if (taskArgs.subscriptiondeposit <= 0) {
      throw new Error('--subscriptiondeposit must be greater than 0')
    }

    // Function Metadata
    const request = {
      fees: ethers.utils.parseEther('0.002'),
      functionName: 'Test Function 2',
      desc: 'Test description',
      imageUrl: 'https://image.url/',
      expectedArgs: ['principalAmount', 'APYTimes100'],
      codeLocation: 0,
      secretsLocation: 0,
      language: 0,
      subId: Number(process.env.FUNCTIONS_SUBSCRIPTION_ID),
      source: fs.readFileSync('./calculation-example.js').toString(),
      secrets: [],
    }

    if (!request.subId || Number(request.subId) <= 0) {
      throw new Error('Request must have a valid subscription ID')
    }
    console.log(`Request subscription ID: ${request.subId}`)
    // Attach to the required contracts
    const [signer] = await ethers.getSigners()
    const functionsManagerRaw = await ethers.getContractAt(
      'FunctionsManager',
      taskArgs.functionsmanager
    )
    const functionsManager = functionsManagerRaw.connect(signer)
    console.log(`Connecting to functions manager as ${signer.address}`)

    const transaction = await functionsManager.registerFunction(request, {
      value: request.subId ? 0 : taskArgs.subscriptionDeposit,
      gasLimit: taskArgs.gaslimit,
    })

    const receipt = await transaction.wait(1)
    if (receipt.events && receipt.events[0] && receipt.events[0].args) {
      const functionId = receipt.events[0].args['functionId'].toString()
      console.log(`Registed functions with id: ${functionId}`)
      const functionInfo = await functionsManager.getFunction(functionId)
      console.log(JSON.stringify(functionInfo))
    }
  })
