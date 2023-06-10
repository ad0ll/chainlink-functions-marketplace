## Inspiration

Our team is in the industry, and we know how much work it takes to create an Oracle-based integration. When Chainlink
Functions were announced, we saw the opportunity to let users create good-enough integrations for very cheap.

## What it does

* It has never been easier to get web2 data into your contract. Allows users to deploy a Chainlink Functions-based
  integration without ever having to touch a smart contract or Subscription*
* Lets sellers profit from their Chainlink Functions-based integrations by selling access to other users. Provides
  sellers with dashboards and metrics to monitor performance.
* Dynamically generates example contracts that can be used to consume a Chainlink Functions-based integration
* Provides developers with a landing page to find and buy existing integrations, saving them the time and money it takes
  to reinvent the wheel
* Presents general UI to monitor, observe, and experiment with Chainlink Functions and many parts of the Chainlink
  Functions ecosystem
* Allows you to run Chainlink Functions-based integrations right in the webapp
* Provides automatically generated example contracts that can be copied and pasted directly into Remix or used as a
  bootstrap for web3 products
  *=The deployed version of the contract does not let users create new subscriptions, so some pre-work is necessary

## How we built it

* React, web3-react, ethers.js, subgraphs and Graph Protocol tooling, Apollo
* Solidity + hardhat
* Chainlink Functions
* Sponsor tech: QuickNode + Satsuma

### Specifically...

Our FunctionsManager contract stores Chainlink Function metadata in a local collection. Such metadata is provided by a "
Seller"

* Either a new subscription is created (by default)  or the Seller provides an existing subscription. The
  FunctionsManager contract is added as an authorized consumer.
* The FunctionsManager sells access to the Seller's subscription to external (unauthorized) users for a premium fee set
  by the seller. External users are "Buyers"
* When an external user calls a Chainlink Functions based integration, the FunctionsManager collects the access (premium
  fee), which goes to the Seller, and the base fee, which goes to Chainlink Lab's billing (subscription)
* The webapp is an interface for the contract, allowing users to create, observe, monitor, and run integrations. It has
  a ton of QoL features that we think improves the overall user experience around Chainlink Functions

## Challenges we ran into

* We had very little experience with Solidity and no experience with web3 connected webapps.
* We had 5 team members coming into the project. Two dropped the first week. The last dropped the week before the
  deadline with no contributions.
* The economic viability of the product is largely dependent on the fee users have to pay per use, at least on L2.
  Chainlink Lab's contract has a flat 0.2 base fee for Functions calls. This is prohibitively high for frequent use,
  impacts the pitch, and there's nothing we can do about it.
* We couldn't figure out how to easily decode logs in Polygonscan. A good portion of our troubleshooting was based on
  intuition and experimentation as a result.
* It took a long time to set up mocks to run raw tests, the functions-hardhat-starter-repo. We didn't have everything we
  needed for a PoC until about 3 weeks in, so mocks were key in early iteration.
* We had to come up with a lot of vocabulary to clearly describe what parts of our product were our creation, and what
  parts were enabled through Chainlink functions.

## Accomplishments that we're proud of

* We think that, for a team size of two, there's a huge amount of features loaded into the Functions Marketplace. We're
  really proud that the app is live and usable and that there's very few asterisks attached.
* While there's a lot of room for improvement, especially around gas costs, this is the first real web3 product that
  we've worked on, and we think the contracts and hardhat work is not bad for a first effort.
* We think we're coming out of this project with a more in-depth understanding of Chainlink Functions than most,
  especially after building mocks and implementing their interfaces.

## What we learned

* Solidity
* hardhat
* Smart contract testing
* web3-react
* Subgraphs and Graph Protocol tooling

## What's next for Functions Marketplace

* Allowing you to run your source code against a simulated DON within the app when creating a new function
* Allowing web3 users to specify custom callbacks in their contracts
* Allowing sellers to collect their premium fee in native tokens and USDC (doing the LINK conversion inline)
* Adding support for pricing tiers based on usage over some period of time
* Moving some metrics from the contract into the subgraph generation so we can save on gas costs
* Allowing users to deploy the example contract right from the webapp
* Adding the ability for sellers to upload branding to identify themselves
