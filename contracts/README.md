# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

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

1. Delete the `graph` directory
2. Get your free credits for QuickNode (see Discord for links)
3. Create a new endpoint w/ the Satsuma subgraph plugin
4. Get your subgraph deploy command from Satsuma (three dots next to the plugin listing > Dashboard in the QuickNode UI)
5. Run "graph init", example responses:

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

- Raw (not recommended): `npx hardhat run scripts/deploy.ts --network polygonMumbai`
- Automated + convenience, requires .envrc: `./deploy.sh`

### Create a subscription

test-network is set to the correct value below

```bash
npx hardhat create-subscription --functions-manager $FUNCTIONS_MANAGER_ADDR --test-network polygonMumbai  --network $HARDHAT_NETWORK
```

### Fund an existing subscription with 1 LINK and authorize FunctionsManager as consumer

test-network is set to the correct value below

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
