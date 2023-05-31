//Functions and components that are used to render snippets
import React, {FC} from "react"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";
import {FunctionRegistered} from "./gql/graphql";

export type FunctionArg = {
    name: string
    type: string
    defaultValue?: string
    comment?: string
}


export const BashSyntaxHighlighter: FC<{ children: string | string[] }> = ({children}) => {
    return (<SyntaxHighlighter style={vscDarkPlus} showLineNumbers={true} language={"bash"}>
        {children}
    </SyntaxHighlighter>)
}

export const JavascriptSyntaxHighlighter: FC<{ children: string | string[] }> = ({children}) => {
    return (<SyntaxHighlighter style={vscDarkPlus} showLineNumbers={true} language={"javascript"}>
        {children}
    </SyntaxHighlighter>)
}

export const SoliditySyntaxHighlighter: FC<{ children: string | string[] }> = ({children}) => {
    return (<SyntaxHighlighter style={vscDarkPlus} showLineNumbers={true} language={"solidity"}>
        {children}
    </SyntaxHighlighter>)
}


type GenerateSnippetOptions = {
    hardcodeParameters: boolean,
    // TODO callback function is probably not going to be a string, most likely bytes32 or uint256. Unknown until we work on the dynamic callback feature
    callbackFunction: "storeFull" | "storePartial" | "doNothing" | string // presets are for completions in IDEs
    returnRequestId: boolean
}

const generateParameterString = (args: FunctionArg[], renderType: "placeholders" | "paramWithType" | "paramNameOnly"): string => {
    if (!args || args.length === 0) {
        return ""
    }
    return args.map((arg) => {
        switch (renderType) {
            case "placeholders":
                return `"<${arg.name}>"`
            case "paramWithType":
                return `string calldata _${arg.name}`
            case "paramNameOnly":
                return `_${arg.name}`
            default:
                throw new Error(`Unknown renderType ${renderType} passed to snippet string generator`)
        }
    }).join(", ")
}

export const splitArgStrings = (argStrings?: string[]): FunctionArg[] => {
    if (!argStrings) {
        return []
    }
    return argStrings?.map(splitArgString)
}
export const splitArgString = (argString: string): FunctionArg => {
    const split = argString.split(":")
    if (split.length === 1) {
        return {
            name: split[0],
            type: "string"
        }
    }
    if (split.length === 2) {
        return {
            name: split[0],
            type: split[1]
        }
    }
    return {
        name: split[0],
        type: split[1],
        comment: split[2]
    }
}

const generateCallString = (func: FunctionRegistered, functionManagerContractAddress: string, opts: GenerateSnippetOptions) => {
    // TODO hardcoded sendRequest makes me really nervous. Can we replace this by scraping the ABI once the FunctionManager contract is done?

    //TODO fix hardcoded network
    const sendRequestArgs: string = opts.hardcodeParameters ? generateParameterString(splitArgStrings(func.metadata_expectedArgs), "placeholders") : generateParameterString(splitArgStrings(func.metadata_expectedArgs), "paramNameOnly")

    /*
    useCall:
    (bool success, bytes result) = contractAddress.call(abi.encodeWithSelector(sig, [PARAMETER_STRING or PLACEHOLDER_STRINGS], CALLBACK_FUNCTION));
     */
    return `
            address functionManager = ${functionManagerContractAddress};
            bytes memory payload = abi.encodeWithSignature("sendRequest(address, string[] calldata, string calldata");
            (bool success, ${opts.returnRequestId ? "bytes result" : ""}) = functionManager.call(abi.encodeWithSelector(sig, ${func.functionId} [${sendRequestArgs}], "${opts.callbackFunction}"));
            require(success, "Failed to call sendRequest function.");
            ${opts.returnRequestId ? "return abi.decode(result, (bytes32))" : ""}
        `.replace("\t", "").replace("    ", "")
}

export const generateSnippetString = (func: FunctionRegistered, functionManagerAddress: string, opts: GenerateSnippetOptions) => {
    const parameterString = opts.hardcodeParameters && func.metadata_expectedArgs?.length > 0 ? "" : generateParameterString(splitArgStrings(func.metadata_expectedArgs), "paramWithType")

    return `function (${parameterString}) public view returns (bytes32) {
       ${generateCallString(func, functionManagerAddress, opts)}
    }`
}

export const generateDefaultSnippetString = (func: FunctionRegistered, functionManagerAddress: string) => {
    return generateSnippetString(func, functionManagerAddress, {
        hardcodeParameters: true,
        callbackFunction: "storeFull",
        returnRequestId: true
    })
}


/* TODO Callback generator:
A guided UI that lets you add steps to build and deploy your own custom callback function
Steps allowed:
- Store permanent, full error
- Store permanent, bool error
- Store latest, full error
- Store latest, bool error
- Call another callback function
- Call another function
- Emit an event
 */