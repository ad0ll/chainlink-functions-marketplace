import React, {ReactNode, Suspense} from "react";
import {Box, SvgIcon, Typography, TypographyProps} from "@mui/material";
import LinkTokenIcon from "./assets/icons/link-token-blue.svg";
import {Buffer} from 'buffer';
import {FunctionsManager} from "./generated/contract-types";
import {FunctionRegistered} from "./gql/graphql";
import {BigNumberish, ethers} from "ethers";

export const BASE_FEE = 200000000000000000n; //0.2 LINK
export const MUMBAI_CHAIN_ID = 80001
export const SEPOLIA_CHAIN_ID = 11155111
export const SHORT_POLL_INTERVAL = 2000
export type CombinedFunctionMetadata =
    FunctionsManager.FunctionMetadataStruct
    & FunctionsManager.FunctionExecuteMetadataStruct

export enum ExpectedReturnTypes {
    Bytes = 0,
    Uint,
    Int,
    String
}

export type NetworkConfig = {
    functionsManager: "0x47564e344A2E0f5E73dd41ae1142530C01f10471",
    // functionsManager: "0x47564e344A2E0f5E73dd41ae1142530C01f10471",
    linkToken: string,
    linkEthPriceFeed: string,
    functionsOracleProxy: string,
    functionsBillingRegistryProxy: string,
    functionsPublicKey: string,
    getScannerAddressUrl: (address: string) => string,
    getScannerTxUrl: (address: string) => string,
}

// This was pulled from the hardhat starter kit's network-config.js file at the repo root
export const networkConfig: {
    [key: number]: NetworkConfig
} = {
    [MUMBAI_CHAIN_ID]: {
        // functionsManager: "0x47564e344A2E0f5E73dd41ae1142530C01f10471",
        functionsManager: "0x47564e344A2E0f5E73dd41ae1142530C01f10471",
        // demoFunctionsManager: "0x3744551b069e845B3E1A2832a17F7175Fcf2CB96",
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
        functionsManager: "0x47564e344A2E0f5E73dd41ae1142530C01f10471",
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
                            height = 25,
                            width = 25,
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

    return now - (n * 24 * 60 * 60)
}

export const decodeResponse = (response?: string, err?: string, returnType?: number | string | bigint): string => {
    if (err && err !== "0x") {
        const errorHex = Buffer.from(err.slice(2), "hex").toString()
        return errorHex;
    }


    if (!response) {
        return ""
    }
    let decodedOutput;
    switch (returnType) {
        case 0: //Buffer
        case 0n:
        case "0":
            console.log("Received buffer input, attempting to decode to string");
            decodedOutput = Buffer.from(
                response.slice(2),
                "hex"
            ).toString();
            break;
        case 1: //uint256
        case 1n:
        case "1":
            decodedOutput = BigInt("0x" + response.slice(2).slice(-64)).toString();
            break;
        case 2: //int256
        case 2n:
        case "2":
            decodedOutput = signedInt256toBigInt(
                "0x" + response.slice(2).slice(-64)
            ).toString();
            break;
        case 3:
        case 3n:
        case "3":
        default:
            decodedOutput = Buffer.from(
                response.slice(2),
                "hex"
            ).toString();
    }


    return decodedOutput

}
export const returnTypeEnumToString = (num?: number | bigint | string) => {
    if (num === undefined) {
        return "unknown"
    }
    if (typeof num === "string") {
        switch (num) {
            case "0":
                return "buffer";
            case "1":
                return "uint256";
            case "2":
                return "int256";
            case "3":
                return "string";
            default:
                return "buffer";
            // throw new Error("Unknown buffer type");
        }
    }

    switch (num) {
        case 0:
            return "buffer";
        case 1:
            return "uint256";
        case 2:
            return "int256";
        case 3:
            return "string";
        case 0n:
            return "buffer";
        case 1n:
            return "uint256";
        case 2n:
            return "int256";
        case 3n:
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

export const functionRegisteredToCombinedMetadata = (func?: FunctionRegistered): CombinedFunctionMetadata => {
    if (!func) {
        return {} as CombinedFunctionMetadata
    }
    return {
        functionId: func.functionId,
        name: func.metadata_name,
        desc: func.metadata_desc,
        imageUrl: func.metadata_imageUrl,
        expectedArgs: func.metadata_expectedArgs,
        category: func.metadata_category,
        subId: func.subId,
        expectedReturnType: func.metadata_expectedReturnType,
        owner: func.owner,
        fee: func.fee,
        unlockedProfitPool: 0,
        functionsCalledCount: 0,
        lockedProfitPool: 0,
        failedResponseCount: 0,
        successfulResponseCount: 0,
        totalFeesCollected: 0,
        codeLocation: 0,
        language: 0,
        secretsLocation: 0,
    }
}

export const mergeFunctionMetadataAndExecMetadata = (metadata: FunctionsManager.FunctionMetadataStruct, execMetadata: FunctionsManager.FunctionExecuteMetadataStruct): CombinedFunctionMetadata => {
    return {
        functionId: metadata.functionId,
        name: metadata.name,
        desc: metadata.desc,
        imageUrl: metadata.imageUrl,
        expectedArgs: metadata.expectedArgs,
        category: metadata.category,
        expectedReturnType: metadata.expectedReturnType,
        owner: metadata.owner,
        codeLocation: metadata.codeLocation,
        language: metadata.language,
        secretsLocation: metadata.secretsLocation,
        fee: execMetadata.fee,
        subId: execMetadata.subId,
        unlockedProfitPool: execMetadata.unlockedProfitPool,
        functionsCalledCount: execMetadata.functionsCalledCount,
        lockedProfitPool: execMetadata.lockedProfitPool,
        failedResponseCount: execMetadata.failedResponseCount,
        successfulResponseCount: execMetadata.successfulResponseCount,
        totalFeesCollected: execMetadata.totalFeesCollected,

    }
}
const OutcomeCellText: React.FC<{ text: string, color: string }> = ({text, color}) => {
    return <Typography
        sx={{
            // border: "1px solid " + color,
            // padding: 0.5,
            color: color,
            textAlign: "center",
            // borderRadius: 1.5,
            // maxWidth: 100
        }}
    >{text}</Typography>
}

export const OutcomeCell: React.FC<{
    functionResponse?: FunctionsManager.FunctionResponseStruct
}> = ({functionResponse}) => {
    if (!functionResponse) {
        return <OutcomeCellText color={"grey"} text={"PENDING"}/>
    } else if (functionResponse.err && functionResponse.err !== "0x") {
        return <OutcomeCellText color={"#ff3131"} text={"ERROR"}/>
    } else if (functionResponse.response && functionResponse.response !== "0x") {
        return <OutcomeCellText color={"#31ff87"} text={"SUCCESS"}/>
    }
    return <OutcomeCellText color={"grey"} text={"UNKNOWN"}/>;
}

export const etherUnitsToFixed = (val: bigint, decimals: bigint = 2n) => {
    return ethers.formatUnits(val - (val % (10n ** (18n - decimals))), "ether")
}

export const codeLocationToString = (codeLocation: BigNumberish) => {
    switch (codeLocation) {
        case 0:
        case 0n:
        case "0":
            return "Inline"
        case 1:
        case 1n:
        case "1":
            return "Remote"
        default:
            return "Unknown"
    }
}

export const codeLanguageToStrong = (codeLanguage: BigNumberish) => {
    switch (codeLanguage) {
        case 0:
        case 0n:
        case "0":
            return "JavaScript"
        default:
            return "Unknown"
    }
}