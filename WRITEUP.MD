This is a draft of the writeup for the DevPost submission.

#### Points to touch on

- Easy enough for web2 devs to use
- Extremely low barrier to entry
- Leveraging QuickNode and Satsuma as sponsors

#### Challenges

- Everyone on the team had no or only basic experience with Solidity and web3 tooling
- Base fee is high, which makes the marketplace less economically viable in production
- Team size limit + lost 3 team members the day after the hack-a-thon started
- The hardhat repo didn't have (and didn't necessarily need) instructions to deploy the billing registry and a private local node. This meant we had to aggressively get LINK and MATIC from faucets to pay for the base fee.
- The webapp is driven by contract events, but the contract wasn't able to emit events until about 3 weeks in. To triage, we had to make tooling to simulate events.
- We consistently got execution reverted errors when interaction with the FunctionsBillingProxy and FunctionsOracle contract, and have no idea (still now) how to identify what the errors were. [See here for an example](https://mumbai.polygonscan.com/tx/0x0e82f6ea0dd9584cafb3188f0679c808906ba2ace5cc1d2ff4ced37c1de803c7)