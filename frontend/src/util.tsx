import React, {SyntheticEvent} from "react";
import Jazzicon from "./Jazzicon";
import {renderToStaticMarkup} from "react-dom/server";


export const addressToJazziconSeed = (address: string | undefined) =>
    address ? parseInt(address.slice(0, 10)) : 0;

export const jazziconImageString = (address: string | undefined) => {
    const svgString = encodeURIComponent(renderToStaticMarkup(<Jazzicon seed={addressToJazziconSeed(address)}/>))
    return `data:image/svg+xml,${svgString}`
}
export const fallbackToJazzicon = (e: SyntheticEvent<HTMLImageElement, Event>, address: string | undefined) => {
    // @ts-ignore
    e.target.src = jazziconImageString(address);
}


// TODO below regex is just a basic check. Should use ethers to see if string is actually an address
function isEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export const truncateIfAddress = (s: string) => {
    if (isEthereumAddress(s)) {
        return `${s.slice(0, 6)}...${s.slice(-4)}`
    }
    return s
}

export const renderCurrency = (amount: number | string, fixed: number = 3, decimals: number = 18) => {
    if (typeof amount === "string") {
        amount = parseFloat(amount)
    }
    return (amount / Math.pow(10, decimals)).toFixed(fixed)
}