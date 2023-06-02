import React from "react";
import {MUMBAI_CHAIN_ID, networkConfig, SEPOLIA_CHAIN_ID} from "./common";
import {useWeb3React} from "@web3-react/core";
import {Typography} from "@mui/material";
import {useContract} from "./contractHooks";
import FunctionsManagerJson from "./generated/abi/FunctionsManager.json";
import {FunctionsManager} from "./generated/contract-types";
import {JsonRpcProvider} from "@ethersproject/providers";


export const FunctionsManagerContext = React.createContext<{
    chainId: typeof MUMBAI_CHAIN_ID | typeof SEPOLIA_CHAIN_ID,
    account: string,
    provider: JsonRpcProvider,
    functionsManagerContract: FunctionsManager
    networkConfig: any
}>({
    chainId: MUMBAI_CHAIN_ID,
    account: "",
    provider: new JsonRpcProvider(""),
    functionsManagerContract: {} as FunctionsManager,
    networkConfig: {}
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

    const functionsManagerContract = useContract(networkConfig[chainId].functionsManager, FunctionsManagerJson.abi) as unknown as FunctionsManager;
    return <FunctionsManagerContext.Provider value={{
        chainId,
        account,
        provider,
        functionsManagerContract,
        networkConfig: networkConfig[chainId]
    }}>
        {children}
    </FunctionsManagerContext.Provider>
}