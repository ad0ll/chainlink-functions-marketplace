# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a
script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

# Deploying a new graph

This is done wth the graph cli, QuickNode, and Satsuma

If events in the FunctionsManager change and you have to re-run the codegen, the steps are more involved

1. Deploy the update FunctionsManager contract with deploy.sh
2. Delete the entire FunctionsManager section from subgraph.yaml, but DO NOT delete the other entities
3. Run the following to add the FunctionsManager back to the subgraph

```bash
graph add $FUNCTIONS_MANAGER_ADDR --contract-name FunctionsManager --abi ../artifacts/contracts/FunctionsManager.sol/FunctionsManager.json
```

4. Deploy using the satsuma command (see Discord)

If you have to rebuild the subgraphs for the FunctionsOracle or the FunctionsBillingRegistry, the steps are complex:
Add commands:

```bash
graph add 0x3c79f56407DCB9dc9b852D139a317246f43750Cc --contract-name FunctionsBillingRegistry --abi ../artifacts/contracts/functions/FunctionsBillingRegistry.sol/FunctionsBillingRegistry.json
graph add 0x649a2C205BE7A3d5e99206CEEFF30c794f0E31EC --contract-name FunctionsOracle --abi ../artifacts/contracts/functions/FunctionsOracle.sol/FunctionsOracle.json
```

The codegen will break FunctionsOracle because
of [this issue](https://github.com/graphprotocol/graph-tooling/issues/1017). You can fix it by replacing all instances
of the following in graph/src/\*:

```typescript
entity.senders = event.params.senders;
```

with the following (bytes import from graphprotocol dependency):

```typescript
entity.senders = changetype<Bytes[]>(event.params.senders);
```

Then comment out handleConfig from graph/src/functions-oracle.ts (I don't know why this is failing, but our mocks aren't
simulating a DON, so we don't need to listen for config events)

Then common out handleConfig from subgraph.yyaml

```
✔ Protocol · ethereum
✔ Product for which to initialize · subgraph-studio
✔ Subgraph slug ·  (<- leave blank)
✔ Directory to create the subgraph in · ./graph
✔ Ethereum network · mumbai
✔ Contract address · 0x0bdcF222aB9300b58fB13352401cb5894426dF17
✖ Failed to fetch ABI from Etherscan: ABI not found, try loading it from a local file
✖ Failed to fetch Start Block: Failed to fetch contract creation transaction hash
✔ ABI file (path) · ./artifacts/contracts/EventSpammer.sol/EventSpammer.json
✔ Start Block · 0
✔ Contract Name · EventSpammer
✔ Index contract events as entities (Y/n) · true
```

5. Run your subgraph deploy command from step 3 in the graph directory

# Commands

### Some of the below commands edit .envrc file. Please make sure you have [direnv](https://direnv.net/) installed and configured, and create a .envrc file at (<repo root>contracts/.envrc (i.e. the cwd of this README/.envrc) with the following content:

```bash
# Some stuff is hardcoded for mumbai, don't recommend changing this
export HARDHAT_NETWORK="polygonMumbai"
# quicknode-url (get this from Discord)
export POLYGON_MUMBAI_RPC_URL=""
export PRIVATE_KEYS="<comma separated list of private keys>"
export PRIVATE_KEY="<single private key used in some scripts>"
# optional, used in spam-events scripts, if not supplied, will deploy the EventSpammer
export EVENT_SPAMMER_ADDR=""
# Required by some scripts/tasks
export FUNCTIONS_MANAGER_ADDR=""
```

### Deploy the FunctionManager contract

- Automated + updates all references in the code: `./deploy.sh`
- Raw (not recommended): `npx hardhat run scripts/deploy.ts --network polygonMumbai`

### Create a subscription

test-network should point to the key in network-config.js, so below, polygonMumbai is correct (even though the network
name in hardhat is mumbai)

```bash
npx hardhat create-subscription --functions-manager $FUNCTIONS_MANAGER_ADDR --test-network polygonMumbai  --network $HARDHAT_NETWORK
```

### Fund an existing subscription with 1 LINK and authorize FunctionsManager as consumer

test-network should point to the key in network-config.js, so below, polygonMumbai is correct (even though the network
name in hardhat is mumbai)

```bash
npx hardhat create-subscription --functions-manager $FUNCTIONS_MANAGER_ADDR --test-network polygonMumbai --subscription-id 941  --network $HARDHAT_NETWORK
```

### Register a function

```bash
npx hardhat register-function --network polygonMumbai --functionsmanager $FUNCTIONS_MANAGER_ADDR
```

### Do a run of a function:

```bash
npx hardhat execute-function --functions-manager $FUNCTION_MANAGER_ADDR --network $HARDHAT_NETWORK --function-id <hex-string-of-function-id>
```

## How to get maximum testnet MATIC from faucets

We use a lot of MATIC and LINK. Here's the routine to get as much as possible each day:

1. Set up two accounts in metamask
2. Make sure one of the accounts has 0 MATIC. If needed, transfer all testnet MATIC to the other account
3. Go to https://faucet.polygon.technology/, and get 1 MATIC for the account that has 0 MATIC
4. Transfer the 1 MATIC to the other account (so you don't have to worry about it the next day)
5. Go to Alchemy's faucet https://mumbaifaucet.com/, **DON'T SIGN IN**, get 0.5 MATIC
6. Sign it with your Alchemy account. Get 1 MATIC.
7. Go to https://faucets.chain.link/mumbai, and get 0.5 MATIC and 20 LINK

npx hardhat get-subscription --billingregistry 0xEe9Bf52E5Ea228404bB54BCFbbDa8c21131b9039 --subscriptionid 941 --checkauth $FUNCTIONS_MANAGER_ADDR

## Run tests against mocks for gas reports

Mocks aren't completely accurate (maybe 70-80%), but they're close enough for ballparks.

```bash
    REPORT_GAS=true npx hardhat test --network hardhat
```

## Add user to a subscription:

```bash
npx hardhat add-user-to-subscription --network polygonMumbai --test-network mumbai --subscriptionid $FUNCTIONS_SUBSCRIPTION_ID --authorizeuser 0x6e21f424111492b79f24e5400412913af2820a01
```

## Seed a deployed functions manager with functions + calls:

```bash
npx hardhat seed-functions-manager --network polygonMumbai --functionsmanager $FUNCTIONS_MANAGER_ADDR
```
