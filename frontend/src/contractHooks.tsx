import {getAddress} from '@ethersproject/address'
import {AddressZero} from '@ethersproject/constants'
import {Contract} from 'ethers'
import type {JsonRpcProvider, JsonRpcSigner} from '@ethersproject/providers'
import {useWeb3React} from "@web3-react/core";
import {useMemo} from "react";

// Below code is copied from Uniswap/interface: https://github.com/Uniswap/interface/blob/main/src/utils/index.ts
// Wish they had documentation for web3-react

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
    try {
        // Alphabetical letters must be made lowercase for getAddress to work.
        // See documentation here: https://docs.ethers.io/v5/api/utils/address/
        return getAddress(value.toLowerCase())
    } catch {
        return false
    }
}

function getProviderOrSigner(provider: JsonRpcProvider, account?: string): JsonRpcProvider | JsonRpcSigner {
    return account ? getSigner(provider, account) : provider
}


// account is not optional
function getSigner(provider: JsonRpcProvider, account: string): JsonRpcSigner {
    return provider.getSigner(account).connectUnchecked()
}

export function getContract(address: string, ABI: any, provider: JsonRpcProvider, account?: string): Contract {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }

    return new Contract(address, ABI, getProviderOrSigner(provider, account) as any)
}

// returns null on errors
export function useContract<T extends Contract = Contract>(
    addressOrAddressMap: string | { [chainId: number]: string } | undefined,
    ABI: any,
    withSignerIfPossible = true
): T | null {
    const {provider, account, chainId} = useWeb3React()

    return useMemo(() => {
        if (!addressOrAddressMap || !ABI || !provider || !chainId) return null
        let address: string | undefined
        if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
        else address = addressOrAddressMap[chainId]
        if (!address) return null
        try {
            return getContract(address, ABI, provider, withSignerIfPossible && account ? account : undefined)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [addressOrAddressMap, ABI, provider, chainId, withSignerIfPossible, account]) as T
}