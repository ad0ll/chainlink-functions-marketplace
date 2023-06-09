//Functions and components that are used to render snippets
import React, {FC, useContext, useEffect, useState} from "react"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";
import {FunctionRegistered} from "./gql/graphql";
import {CombinedFunctionMetadata, functionRegisteredToCombinedMetadata, returnTypeEnumToString} from "./common";
import {formatEther, parseUnits} from "ethers";
import {FunctionsManagerContext} from "./FunctionsManagerProvider";
import {FunctionsBillingRegistryInterface} from "./generated/contract-types";

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
    inlineInterfaces: boolean,
    hardcodeAddresses: boolean,
    makeGeneric: boolean;
    allowDeposit: boolean;
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

// This is a cosmic horror
export const generateSnippetString = (func: CombinedFunctionMetadata, opts: GenerateSnippetOptions) => {

    const {networkConfig, functionsBillingRegistry, chainId} = useContext(FunctionsManagerContext)
    const [baseFee, setBaseFee] = useState<bigint>(0n)
    // This useEffect is really gross, is this going to be a double load on init?
    useEffect(() => {
        const fetchData = async () => {
            const requestBilling: FunctionsBillingRegistryInterface.RequestBillingStruct = {
                subscriptionId: func.subId,
                client: func.owner,
                gasLimit: 300_000,
                gasPrice: parseUnits("30", "gwei")
            }
            setBaseFee(await functionsBillingRegistry.getRequiredFee("0x", requestBilling))
        }
        fetchData()

    }, [func])
    let renderConstructor: string = `constructor() {
        linkToken = LinkTokenInterface(${networkConfig.linkToken});
        functionsManager = FunctionsManagerInterface(${networkConfig.functionsManager});
        linkToken.approve(address(functionsManager), 1_000_000_000 ether);
    }`
    if (!opts.hardcodeAddresses) {
        renderConstructor = `constructor(address _linkToken, address _functionsManager) {
        linkToken = LinkTokenInterface(_linkToken);
        functionsManager = FunctionsManagerInterface(_functionsManager);
        linkToken.approve(address(functionsManager), 1_000_000_000 ether);
    }`
    }
    const argsAsFunctionArg = splitArgStrings(func.expectedArgs)

    let parameterString: string = ""
    if (opts.makeGeneric) {
        parameterString = "bytes32 _functionId, string[] calldata _args"
    } else if (!opts.hardcodeParameters && func.expectedArgs?.length > 0) {
        parameterString = generateParameterString(argsAsFunctionArg, "paramWithType")
    }
    const feeRender = formatEther(BigInt(func.fee) + baseFee);
    const renderFunctionId = opts.makeGeneric ? "_functionId" : func.functionId
    let renderArgs: string = "";
    if (!opts.makeGeneric && func.expectedArgs.length > 0) {
        renderArgs = `\n        string[] memory args = new string[](${func.expectedArgs.length});\n`

        renderArgs += argsAsFunctionArg.map((arg, index) => {
            return `        args[${index}] = ${opts.hardcodeParameters ? `"<${arg.name}>"` : `_${arg.name}`};`
        }).join("\n")
        renderArgs += "\n"
    }


    return `pragma solidity ^0.8.18;
    
${opts.inlineInterfaces
        ? `interface LinkTokenInterface {
    function allowance(address owner, address spender) external view returns (uint256 remaining);
    function approve(address spender, uint256 value) external returns (bool success);
    function balanceOf(address owner) external view returns (uint256 balance);
    function transferFrom(address from, address to, uint256 value) external returns (bool success);
}

interface FunctionsManagerInterface {
    function executeRequest(bytes32 functionId, string[] calldata args) external returns (bytes32);
}` : `import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {FunctionsManagerInterface} from "chainlink-functions-marketplace/contracts/interfaces.FunctionsManagerInterface.sol";`}

contract Snippet {

    LinkTokenInterface linkToken${opts.hardcodeAddresses ? ` = LinkTokenInterface(${networkConfig.linkToken})` : ""};
    FunctionsManagerInterface functionsManager${opts.hardcodeAddresses ? ` = FunctionsManagerInterface(${networkConfig.functionsManager})` : ""};

    ${renderConstructor}

    /// @notice Sends a request to the ${func.name} integration
    ${argsAsFunctionArg.map((arg, i) => {
        return `${i === 0 ? "" : "    "}/// @param ${arg.name} ${arg.comment}`
    }).join("\n")}
    /// @return A requestId that can be used to retrieve an array of bytes representing 
    //          a/an ${returnTypeEnumToString(func.expectedReturnType)} once the request is fulfilled
    function sendRequest(${parameterString}) public returns (bytes32) {
        require(
            linkToken.allowance(msg.sender, address(this)) >= ${feeRender} ether,
            "(Snippet) User is not approved to transfer LINK to the FunctionsManager"
        );
        require(linkToken.balanceOf(msg.sender) >= ${feeRender} ether, "(Snippet) User does not have enough LINK");
        linkToken.transferFrom(msg.sender, address(this), ${feeRender} ether);\
        ${renderArgs}
        return functionsManager.executeRequest(${renderFunctionId}, ${opts.makeGeneric ? "_args" : "args"});
    }
    ${opts.allowDeposit ? `/// @notice Allows the contract to receive LINK tokens
    function deposit(uint256 _amount) public {
        require(linkToken.transferFrom(msg.sender, address(this), _amount), "Unable to transfer");
    }` : ""}
}`
}

// function sendRequest (${parameterString}) public ${opts.returnRequestId ? "returns (bytes32)" : ""} {
//     address functionManager = ${networkConfig[chainId].functionsManager};
// (bool success, ${opts.returnRequestId ? "bytes memory result" : ""}) = functionManager.call(abi.encodeWithSignature("executeRequest(address,string[])", ${func.functionId}, [${sendRequestArgs}]));
// require(success, "Failed to call sendRequest function.");
// ${opts.returnRequestId ? "return abi.decode(result, (bytes32));" : ""}
// }
export const generateDefaultSnippetString = (func: FunctionRegistered) => {
    return generateSnippetString(functionRegisteredToCombinedMetadata(func), {
        hardcodeParameters: true,
        makeGeneric: false,
        hardcodeAddresses: true,
        inlineInterfaces: true,
        allowDeposit: false
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