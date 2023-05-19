# Functions Marketplace Frontend

All code for the frontend. This is a plain React App.

Preview of main is typically [here](https://functions-marketplace-lonk-fm.vercel.app/).

Key libraries being used:

- apollo-client
- material-ui
- react-router
- react-hook-form
- ethers (v6, most examples on web are for v5, can ping @adoll if you need help)
- web3-react (v8, documentation is non-existent, can ping @adoll if you need help)
- recoil (not actually using this anywhere atm, but it's there)

## Build and run

To run: `yarn && yarn start`

## Deployment

You can deploy by setting up a vercel account and then using the [vercel cli](https://vercel.com/docs/cli) to deploy.

The command is: `yarn build && vercel deploy`
OR for production: `yarn build && vercel deploy --prod`

Vercel is expensive for teams, so here's links for each team member:

* ad0ll: https://functions-marketplace-lonk-fm.vercel.app/

### Deployment after contract updates

When you need to deploy a new version of the FunctionManager, there's a few things you need to change:

1. Update the functionManagerAddress in [./src/common.tsx](./src/common.tsx)
2. Download the latest schema from Satsuma (this assumes the person who updated the contract updated the subgraph)
   with `yarn codegen`

Note, some code is wired to the EventSpammer contract. This contract is being used as a placeholder for real events
while the contracts are underway.

## What should I do?

* [See Notion for big tasks](https://www.notion.so/TODO-List-a0cd6383bafb4fc8850896c3063262b9)
* Easy wins are littered in the code as TODO items
