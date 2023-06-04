This is a draft of the writeup for the DevPost submission.

#### Points to touch on

- Easy enough for web2 devs to use
- Extremely low barrier to entry
- Leveraging QuickNode and Satsuma as sponsors

#### Things were are proud of

- We think that we've successfully hidden all of the complexity involved in setting up subscriptions and deploying
  functions
- We think that the web2 app is accessible to web2 devs and that the app does effectively give any developer a means to
  sell their data

#### Challenges

- Both team members had only cursory experience with Solidity and web3 tooling, so there was lots to learn
- The unavoidable base fee of 0.2 LINK is expensive.It makes the argument of "you could pay an engineer to do x" less
  compelling, and thus makes the marketplace less economically viable in production.
- Unexpectedly small team size. We had 10 members interested, selected 5 for the team size limit, then 2 dropped out in
  the first week, and 1 dropped out the week before the project was due without contributing. Our scope was set for a 5
  member team, then a 3 member team, and then we had to shave a handful of planned features when we realized we'd have
  2.
- The hardhat repo didn't have (and didn't necessarily need) instructions to deploy the billing registry and a private
  local node. This meant we had to aggressively get LINK and MATIC from faucets to pay for the base fee.
- The webapp is driven by contract events, but the contract wasn't able to emit events until about 3 weeks in. To
  triage, we had to make tooling to simulate events.
- We consistently got execution reverted errors when interaction with the FunctionsBillingProxy and FunctionsOracle
  contract, and had no idea how to identify them until we had about 3 weeks left.
- We found it challenging to find information on how to deeply customize subgraph indexing. Searching for "xyz graph
  protocol" would typically give us 3-4 Graph Protocol items, then every other search result would point to graph data
  structures and graph api documentation.
- 