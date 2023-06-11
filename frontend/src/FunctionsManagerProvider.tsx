/*
FunctionsManagerProvider reads the state from Metamask and then makes it available to the rest of the app.
It also loads the contracts that we'll use through the entire app
*/
import React from "react";
import {MUMBAI_CHAIN_ID, NetworkConfig, networkConfig, SEPOLIA_CHAIN_ID} from "./common";
import {useWeb3React} from "@web3-react/core";
import {Typography} from "@mui/material";
import {useContract} from "./contractHooks";
import FunctionsManagerJson from "./generated/abi/FunctionsManager.json";
import FunctionsBillingRegistryJson from "./generated/abi/FunctionsBillingRegistry.json";
import {FunctionsBillingRegistry, FunctionsManager} from "./generated/contract-types";
import {JsonRpcProvider} from "@ethersproject/providers";


export const FunctionsManagerContext = React.createContext<{
    chainId: typeof MUMBAI_CHAIN_ID | typeof SEPOLIA_CHAIN_ID,
    account: string,
    provider: JsonRpcProvider,
    functionsManager: FunctionsManager,
    functionsBillingRegistry: FunctionsBillingRegistry,
    networkConfig: NetworkConfig
}>({
    chainId: MUMBAI_CHAIN_ID,
    account: "",
    provider: new JsonRpcProvider(""),
    functionsManager: {} as FunctionsManager,
    functionsBillingRegistry: {} as FunctionsBillingRegistry,
    networkConfig: {} as NetworkConfig,
})

export const FunctionsManagerProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {chainId, account, provider} = useWeb3React()
    if (chainId !== MUMBAI_CHAIN_ID && chainId !== SEPOLIA_CHAIN_ID) {
        return <Typography>Please change your network to Mumbai or Sepolia</Typography>
    }
    if (!account) {
        return <Typography>Please connect to MetaMask by clicking the connect button</Typography>
    }
    if (!provider) {
        return <Typography>Provider not found</Typography>
    }

    const functionsManager = useContract(networkConfig[chainId].functionsManager, FunctionsManagerJson.abi) as unknown as FunctionsManager;
    const functionsBillingRegistry = useContract(networkConfig[chainId].functionsBillingRegistryProxy, FunctionsBillingRegistryJson.abi) as unknown as FunctionsBillingRegistry;

    return <FunctionsManagerContext.Provider value={{
        chainId,
        account,
        provider,
        functionsManager,
        functionsBillingRegistry,
        networkConfig: networkConfig[chainId]
    }}>
        {children}
    </FunctionsManagerContext.Provider>
}