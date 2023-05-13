#!/bin/bash

# run scripts/deploy.ts and capture output
# HARDHAT_NETWORK should come from .envrc, see README
OUT=$(npx hardhat run scripts/deploy.ts --network $HARDHAT_NETWORK  | tail -n 1)
echo "Output: $OUT"
# extract function manager address from last line of output (macos)
FUNCTIONS_MANAGER_ADDRESS=$(echo $OUT | sed -E 's/.*Deployed FunctionsManager contract to (0x[a-zA-Z0-9]+).*/\1/')
echo "Extracted address: $FUNCTIONS_MANAGER_ADDRESS, replacing in .envrc"

# Replace the value of FUNCTIONS_MANAGER_ADDRESS in .envrc with the address (macos)
sed -i '' "s/FUNCTIONS_MANAGER_ADDR=.*/FUNCTIONS_MANAGER_ADDR=\"$FUNCTIONS_MANAGER_ADDRESS\"/" .envrc
# Run direnv allow
direnv allow