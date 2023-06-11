# Functions Marketplace

This project is a submission for the 2023 Spring Chainlink Hack-a-thon.

"Sell your web2 data on web3". The Functions Marketplace is a decentralized marketplace for web2 data, powered by
Chainlink Functions

There are three parts to the application

1. A webapp that lets users create new Chainlink Functions, and provides snippets that Web3 devs can paste into their
   contracts to instantly gain access to Web2 data
1. A series of contracts that automate all parts of Chainlink Function deployment, subscription management, and fee
   collection. When combined with the webapp, enables web2 devs to sell their data without ever having to write a single
   line of contract code.
2. A series of contracts that use Chainlink Automation to monitor and automatically fill subscriptions, allowing the
   marketplace to function autonomously

## Onboarding

### Code:

#### /contracts

Contains all the contracts for the marketplace, based around HardHat. See the [README](./contracts/README.md) for more
details.

#### /webapp

Contains the webapp for the marketplace. See the [README](./frontend/README.md) for more
details.

### Branch etiquette

* Generally, please avoid working directly on main
* No need for PRs unless you feel like it or want a code review.
* Please avoid merging to main unless your code is working. If you don't feel comfortable merging to main, please feel
  free to ping @ad0ll or @amit4h for help.
* Please notify others of major changes you have on discord with @channel or the person you're working with.
