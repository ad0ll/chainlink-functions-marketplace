import React, {SyntheticEvent} from "react";
import {ChainlinkFunction, networkConfig} from "./common";
import Jazzicon from "./Jazzicon";
import {renderToStaticMarkup} from "react-dom/server";
import {ethers} from "ethers"
import randomWords from "random-words"
import {looseArrayify} from "ethers/types/wallet/utils";

export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const COINGECKO_IMAGE_URL = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fquiin.s3.us-east-1.amazonaws.com%2Forganizations%2Fpictures%2F000%2F004%2F638%2Foriginal%2FCoinGecko_Logo.png%3F1585529895&f=1&nofb=1&ipt=dfc0f4402e132a607d0551b69266e4449bfe5edfb5f994fb1e74031edc2b1d5a&ipo=images"
const BROKEN_ASS_URL = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fquiin.s3.us-east-1.amazonaws.com%2Forganizations%2Fpictures%2F000%2F004images"

export const generateRandomFunction = (): ChainlinkFunction => {
    const addr = (new Date().getUTCMilliseconds() + getRandomInt(100, 9999999999)).toString()
    const imageUrls = [
        "broken ass image url",
        COINGECKO_IMAGE_URL
    ]
    const randName = randomWords({
        exactly: getRandomInt(3, 20),
        formatter: (word) => word.slice(0, 1).toUpperCase().concat(word.slice(1))
    }).join(" ")
    const randDesc = randomWords({
        exactly: getRandomInt(8, 75),
        formatter: (word) => word.slice(0, 1).toUpperCase().concat(word.slice(1))
    }).join(" ")
    return {
        address: addr,
        description: randDesc,
        estimatedGas: getRandomInt(100000, 1000000),
        estimatedGasToken: "MATIC",
        expectedArgs: [],
        fee: getRandomInt(100000, 1000000) / (10 ** getRandomInt(3, 8)),
        functionType: "Price Feed",
        imageUrl: imageUrls[getRandomInt(0, imageUrls.length + 1)],
        name:   randName,
        owner: "0x9B73FC82Ea166ceAd839ff6EF476ac2e696dBA63",
        source: `payable function inoffensiveFunction() public view returns (string memory) {
    if(msg.deposit < 1 ether){
        revert("please pay me")
    }
    return "I'm very hungry";
}`
    }
}

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