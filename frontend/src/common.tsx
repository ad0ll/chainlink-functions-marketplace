import React, {ReactNode, Suspense} from "react";
import {Box, SvgIcon, Typography, TypographyProps} from "@mui/material";
import LinkTokenIcon from "./assets/icons/link-token-blue.svg";
import {Buffer} from 'buffer';

// TODO Fetch the base fee from the FunctionManager contract
export const BASE_FEE = 200000000000000000n; //0.2 LINK
export const MAINNET_CHAIN_ID = 1
export const GOERLI_CHAIN_ID = 5
export const MATIC_CHAIN_ID = 137
export const MUMBAI_CHAIN_ID = 80001
export const SEPOLIA_CHAIN_ID = 11155111
export const SHORT_POLL_INTERVAL = 2000

export enum ExpectedReturnTypes {
    Bytes = 0,
    Uint,
    Int,
    String
}

// This was pulled from the hardhat starter kit's network-config.js file at the repo root
export const networkConfig = {
    mainnet: {
        linkToken: "0x514910771af9ca656af840dff83e8264ecf986ca",
    },
    polygon: {
        linkToken: "0xb0897686c545045afc77cf20ec7a532e3120e0f1",
    },
    [MUMBAI_CHAIN_ID]: {
        functionsManager: "0x3D5b76E593749A3CD8Dc8B1EE9A4e0725dFD36D6",
        linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        linkEthPriceFeed: "0x12162c3E810393dEC01362aBf156D7ecf6159528",
        functionsOracleProxy: "0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4",
        functionsBillingRegistryProxy: "0xEe9Bf52E5Ea228404bB54BCFbbDa8c21131b9039",
        functionsPublicKey:
            "a30264e813edc9927f73e036b7885ee25445b836979cb00ef112bc644bd16de2db866fa74648438b34f52bb196ffa386992e94e0a3dc6913cee52e2e98f1619c",
        getScannerAddressUrl: (address: string) => `https://mumbai.polygonscan.com/address/${address}`,
        getScannerTxUrl: (address: string) => `https://mumbai.polygonscan.com/tx/${address}`,
    },
    [SEPOLIA_CHAIN_ID]: {
        functionsManager: "0x3D5b76E593749A3CD8Dc8B1EE9A4e0725dFD36D6",
        linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        linkEthPriceFeed: "0x42585eD362B3f1BCa95c640FdFf35Ef899212734",
        functionsOracleProxy: "0x649a2C205BE7A3d5e99206CEEFF30c794f0E31EC",
        functionsBillingRegistryProxy: "0x3c79f56407DCB9dc9b852D139a317246f43750Cc",
        functionsPublicKey:
            "a30264e813edc9927f73e036b7885ee25445b836979cb00ef112bc644bd16de2db866fa74648438b34f52bb196ffa386992e94e0a3dc6913cee52e2e98f1619c",
        getScannerAddressUrl: (address: string) => `https://sepolia.etherscan.io/address/${address}`,
        getScannerTxUrl: (txHash: string) => `https://mumbai.polygonscan.com/tx/${txHash}`,
    },
}

// TODO This should be a branded, better looking suspense component
export const DefaultSuspense: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return <Suspense fallback={<div>Loading...</div>}>
        {children}
    </Suspense>
}

export const TypographyWithLinkIcon: React.FC<{
    height?: number,
    width?: number,
    includeSuffix?: boolean
    children: ReactNode
    typographyStyle?: React.CSSProperties
    typographyProps?: TypographyProps
} & TypographyProps> = ({
                            height = "inherit",
                            width = "inherit",
                            includeSuffix = true,
                            children,
                            typographyStyle,
                            typographyProps
                        }) => {
    return <Box style={{"display": "flex", "alignItems": "center"}}>
        <SvgIcon component={LinkTokenIcon} viewBox="0 0 800 800" height={height} width={width}
                 style={{marginRight: 4, ...typographyStyle}}/>
        <Typography {...typographyProps} style={{...typographyStyle, marginRight: 4}}>{children}</Typography>
        {includeSuffix &&
            <Typography {...typographyProps} style={{...typographyStyle, marginRight: 4}}>LINK</Typography>}
    </Box>
}
export const blockTimestampToDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    // const options = {
    //     weekday: 'long',
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric',
    //     hour: 'numeric',
    //     minute: 'numeric',
    //     second: 'numeric',
    //     timeZoneName: 'short'
    // };
    return date.toLocaleString();
}


//Return the current time in seconds since the epoch minus n days, in UTC
export const nDaysAgoUTCInSeconds = (n: number) => {
    const now = Math.floor(Date.now() / 1000)
    console.log(Date.now())
    console.log(Date.now() / 1000)
    console.log("now", now)
    console.log("minus n=", n, "days", now - (n * 24 * 60 * 60))
    return now - (n * 24 * 60 * 60)
}

export const decodeResponse = (response: string, err: string, returnType: number): string => {
    if (err !== "0x") {
        const errorHex = Buffer.from(err.slice(2), "hex").toString()
        return errorHex;
    }

    let decodedOutput;
    switch (returnType) {
        case ExpectedReturnTypes.Bytes: //Buffer
            console.log("Received buffer input, attempting to decode to string");
            decodedOutput = Buffer.from(
                response.slice(2),
                "hex"
            ).toString();
            break;
        case ExpectedReturnTypes.Uint: //uint256
            decodedOutput = BigInt("0x" + response.slice(2).slice(-64)).toString();
            break;
        case ExpectedReturnTypes.Int: //int256
            decodedOutput = signedInt256toBigInt(
                "0x" + response.slice(2).slice(-64)
            ).toString();
            break;
        case ExpectedReturnTypes.String: //string
        default:
            decodedOutput = Buffer.from(
                response.slice(2),
                "hex"
            ).toString();
    }
    const decodedOutputLog = `Decoded as a ${returnTypeEnumToString(
        returnType
    )}: ${decodedOutput}`;

    return decodedOutput

}
export const returnTypeEnumToString = (num: number) => {
    console.log("num", num)
    switch (num) {
        case 0:
            return "buffer";
        case 1:
            return "uint256";
        case 2:
            return "int256";
        case 3:
            return "string";
        default:
            return "buffer";
        // throw new Error("Unknown buffer type");
    }
};
const signedInt256toBigInt = (hex: string) => {
    const binary = BigInt(hex).toString(2).padStart(256, "0");
    // if the first bit is 0, number is positive
    if (binary[0] === "0") {
        return BigInt(hex);
    }
    return -(BigInt(2) ** BigInt(255)) + BigInt(`0b${binary.slice(1)}`);
};
