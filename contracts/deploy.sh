#!/bin/bash

# Compile contracts
echo "Compiling contracts"
npx hardhat compile

# Copy all ABI files to ../frontend/src/generated/abi (all .json but not .dbg.json in all subdirectories of artifacts/contracts)
echo "Copying ABI files to ../frontend/src/abi"
find artifacts/contracts -name "*.json" ! -name "*.dbg.json" -exec cp {} ../frontend/src/generated/abi \;

echo "Copying typechain files for FunctionsManager to ../frontend/src/generated/typechain-types"
cp ./typechain-types/contracts/EventSpammer.ts ../frontend/src/generated/typechain-types/
cp ./typechain-types/contracts/FunctionsManager.ts ../frontend/src/generated/typechain-types/

# run scripts/deploy.ts and capture output
echo "Running deploy script on $HARDHAT_NETWORK with private key $PRIVATE_KEY"
OUT=$(npx hardhat run scripts/deploy.ts --network $HARDHAT_NETWORK  | tail -n 1)
echo "Output from deploy script: $OUT"

# extract function manager address from last line of output (macos)
FUNCTIONS_MANAGER_ADDRESS=$(echo $OUT | sed -E 's/.*Deployed FunctionsManager contract to (0x[a-zA-Z0-9]+).*/\1/')
echo "Extracted address: $FUNCTIONS_MANAGER_ADDRESS, replacing in files"

# Copy ABI files

# Replace the value of FUNCTIONS_MANAGER_ADDRESS in .envrc with the address (macos)
sed -i '' "s/FUNCTIONS_MANAGER_ADDR=.*/FUNCTIONS_MANAGER_ADDR=\"$FUNCTIONS_MANAGER_ADDRESS\"/" .envrc
direnv allow

# Replace functionsManager: .* with functionsManager: $FUNCTIONS_MANAGER_ADDRESS in hardhat.config.ts
echo "Replacing functionsManager address in hardhat.config.ts"
sed -i '' "s/functionsManager: .*,/functionsManager: \"$FUNCTIONS_MANAGER_ADDRESS\",/" hardhat.config.ts

# Replace functionsManager: .*, with functionsManager: "$FUNCTIONS_MANAGER_ADDRESS", in ../frontend/src/common.tsx
echo "Replacing functionsManager address in frontend/src/common.tsx"
sed -i '' "s/functionsManager: .*,/functionsManager: \"$FUNCTIONS_MANAGER_ADDRESS\",/" ../frontend/src/common.tsx

