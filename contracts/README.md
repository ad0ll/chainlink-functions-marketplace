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
npx hardhat register-function --functionsmanager $FUNCTIONS_MANAGER_ADDR --gaslimit 2000000
```

### Do a run of a function:

```bash
npx hardhat execute-function --functions-manager $FUNCTION_MANAGER_ADDR --network $HARDHAT_NETWORK --function-id <hex-string-of-function-id>
```
