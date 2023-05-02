//Functions and components that are used to render snippets
import React, {FC} from "react"
import {Prism as SyntaxHighlighter, SyntaxHighlighterProps} from "react-syntax-highlighter";
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";
import {ChainlinkFunction, FunctionArg, networkConfig} from "./common";


export const BashSyntaxHighlighter: FC<{ children: string | string[] }> = ({children}) => {
    return (<BaseSyntaxHighlighter language={"bash"}>
        {children}
    </BaseSyntaxHighlighter>)
}

export const JavascriptSyntaxHighlighter: FC<{ children: string | string[] }> = ({children}) => {
    return (<BaseSyntaxHighlighter language={"javascript"}>
        {children}
    </BaseSyntaxHighlighter>)
}

export const SoliditySyntaxHighlighter: FC<{ children: string | string[] }> = ({children}) => {
    return (<BaseSyntaxHighlighter language={"solidity"}>
        {children}
    </BaseSyntaxHighlighter>)
}


// TODO (low pri) maybe the style below should depend on dark mode or not?
export const BaseSyntaxHighlighter: FC<SyntaxHighlighterProps> = ({children}, syntaxHighlighterProps) => {
    return (<SyntaxHighlighter style={vscDarkPlus} showLineNumbers={true} {...syntaxHighlighterProps}>
        {children}
    </SyntaxHighlighter>)
}

type GenerateSnippetOptions = {
    useCall: boolean,
    hardcodeParameters: boolean,
    // TODO callback function is probably not going to be a string, most likely bytes32 or uint256. Unknown until we work on the dynamic callback feature
    callbackFunction: "storeFull" | "storePartial" | "doNothing" | string // presets are for completions in IDEs
    returnRequestId: boolean
}

const generateParameterString = (args: FunctionArg[], renderType: "placeholders" | "paramWithType" | "paramNameOnly"): string => {
    if(args.length === 0){
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

const generateCallString = (func: ChainlinkFunction, opts: GenerateSnippetOptions) => {
    // TODO hardcoded sendRequest makes me really nervous. Can we replace this by scraping the ABI once the FunctionManager contract is done?

    //TODO fix hardcoded network
    const functionManagerContractAddress = networkConfig.mumbai.functionManagerContract
    const sendRequestArgs: string = opts.hardcodeParameters ? generateParameterString(func.expectedArgs, "placeholders") : generateParameterString(func.expectedArgs, "paramNameOnly")

    /*
    useCall:
    (bool success, bytes result) = contractAddress.call(abi.encodeWithSelector(sig, [PARAMETER_STRING or PLACEHOLDER_STRINGS], CALLBACK_FUNCTION));

     */
    if(opts.useCall){
        return `
            address functionManager = ${functionManagerContractAddress};
            bytes memory payload = abi.encodeWithSignature("sendRequest(address, string[] calldata, string calldata");
            (bool success, ${opts.returnRequestId ? "bytes result" : ""}) = functionManager.call(abi.encodeWithSelector(sig, ${func.address} [${sendRequestArgs}], "${opts.callbackFunction}"));
            require(success, "Failed to call sendRequest function.");
            ${opts.returnRequestId ? "return abi.decode(result, (bytes32))" : ""}
        `.replace("\t", "").replace("    ","")
    }
    return `
            FunctionManager functionManager = FunctionManagerInterface(${functionManagerContractAddress});
            ${opts.returnRequestId ?
                `bytes32 requestId = functionManager.sendRequest("${func.address}", [${sendRequestArgs}], "${opts.callbackFunction}");`
                : `functionManager.sendRequest("${func.address}", [${sendRequestArgs}], "${opts.callbackFunction}");`
            }   
            ${opts.returnRequestId ? "return requestId;" : ""}`.replace("\t", "").replace("    ","")
}

export const generateSnippetString = (func: ChainlinkFunction, opts: GenerateSnippetOptions) => {
    const parameterString = opts.hardcodeParameters && func.expectedArgs.length > 0 ? "" : generateParameterString(func.expectedArgs, "paramWithType")

    return `function (${parameterString}) public view returns (bytes32) {
       ${generateCallString(func, opts)}
    }`
}

export const generateDefaultSnippetString = (func: ChainlinkFunction) => {
    return generateSnippetString(func, {useCall: true, hardcodeParameters: true, callbackFunction: "storeFull", returnRequestId: true})
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