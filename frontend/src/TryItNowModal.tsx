import React, {ReactNode, startTransition, useEffect, useState} from "react";
import {FunctionRegistered, Query} from "./gql/graphql";
import {decodeResponse, MUMBAI_CHAIN_ID, networkConfig, SEPOLIA_CHAIN_ID} from "./common";
import {JsonRpcProvider} from "@ethersproject/providers";
import {useContract} from "./contractHooks";
import FunctionsManagerJson from "./generated/abi/FunctionsManager.json";
import {FunctionsManager, LinkTokenInterface} from "./generated/contract-types";
import LinkTokenJson from "./generated/abi/LinkTokenInterface.json";
import {useFieldArray, useForm} from "react-hook-form";
import {gql, useQuery} from "@apollo/client";
import {toast} from "react-toastify";
import {AbiCoder, keccak256, parseEther, toUtf8Bytes} from "ethers";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {splitArgStrings} from "./Snippets";

//TODO low pri, add caller
const TRIAL_CALL_COMPLETE_QUERY = gql`
    query TrialCallComplete($requestId: Bytes!){
        #    query TrialCallComplete($caller: Bytes!, $requestId: Bytes!){
        functionCallCompleteds(first: 1, skip: 0, where: {
            requestId: $requestId
        }){
            requestId
            response
            err
        }
    }`
type FormValues = {
    args: {
        value: string
    }[]
}

export const TryItNowModal: React.FC<{
    func: FunctionRegistered,
    chainId: typeof MUMBAI_CHAIN_ID | typeof SEPOLIA_CHAIN_ID
    provider?: JsonRpcProvider,
    account?: string,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({func, chainId, provider, account, open, setOpen}) => {
    const [args, setArgs] = useState<string[]>([]);
    const [requestId, setRequestId] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<ReactNode>(<div/>);
    const functionManagerContract = useContract(networkConfig[chainId].functionsManager, FunctionsManagerJson.abi) as unknown as FunctionsManager
    const linkTokenContract = useContract(networkConfig[chainId].linkToken, LinkTokenJson.abi) as unknown as LinkTokenInterface
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const {register, handleSubmit, getValues, setValue, watch, formState, control} = useForm<FormValues>();
    const {fields, insert, remove} = useFieldArray({
        name: "args", // Specify the name of the array field
        control,
    });
    const {
        loading, data, error
        , startPolling, stopPolling,
    } = useQuery<Query>(TRIAL_CALL_COMPLETE_QUERY, {
        variables: {
            requestId: requestId
        },
        skip: !requestId,
    })
    console.log(loading, data, error)
    const onSubmit = handleSubmit(async (data) => {
        if (!account) {
            toast.error("You must be connected to Metamask to try out a function");
            return
        }

        setRequestId("")
        let allowance = await linkTokenContract.allowance(account, networkConfig[chainId].functionsManager)
        if (allowance < parseEther("1")) {
            toast.info("Your account is not authorized to transfer LINK to the FunctionsManager. Please authorize this transaction to approve LINK transfers.")
            let approveTx = await linkTokenContract.approve(networkConfig[chainId].functionsManager, parseEther("1"))
            let approveReceipt = await provider?.waitForTransaction(approveTx.hash, 1)
            if (approveReceipt?.status !== 1) {
                toast.error("Failed to approve LINK transfers, please try again")
                return
            }
            toast.success("Successfully approved LINK transfers")
        }

        if (!functionManagerContract) return
        const execTx = await functionManagerContract.executeRequest(func.functionId, args, {gasLimit: 1000000});
        setWaitingForResponse(true)

        const execReceipt = await provider?.waitForTransaction(execTx.hash, 1);
        if (execReceipt?.status !== 1) {
            setErrorMsg(<Typography variant={"body1"} color={"error"}>Transaction failed,
                <a href={`${networkConfig[chainId].getScannerTxUrl(execTx.hash)}`} target="_blank">
                    View transaction in scanner for details...
                </a></Typography>)
        }
        const sig = keccak256(toUtf8Bytes("FunctionCalled(bytes32,bytes32,address,address,bytes32,uint96,uint96)"))
        // const sig = keccak256(toUtf8Bytes("executeRequest(bytes32,string[] calldata)"))
        console.log("execReceipt", execReceipt)
        console.log("sig", sig)

        const reqIdLoc = execReceipt?.logs?.find((e) => e.topics[0] === sig)
        if (!reqIdLoc) {
            toast.error("Failed to get requestId from transaction logs")
            return
        }

        const requestId = await AbiCoder.defaultAbiCoder().decode(["bytes32"], reqIdLoc.topics[2])

        startTransition(() => {
            setRequestId(requestId[0])
            setErrorMsg("")
            setWaitingForResponse(true)
            startPolling(500)
        })
    })

    useEffect(() => {
        if (data?.functionCallCompleteds && data.functionCallCompleteds.length > 0) {
            startTransition(() => {
                setWaitingForResponse(false)
                stopPolling()
            })
        }
    }, [data])

    const response: string = data?.functionCallCompleteds?.[0]?.response;
    const err: string = data?.functionCallCompleteds?.[0]?.err;

    console.log("data", data);

    return (<Dialog open={open} onClose={() => setOpen(false)} sx={{padding: 2}}>
        <form onSubmit={onSubmit} style={{padding: 16}}>

            <DialogTitle>Try {func.metadata_name}</DialogTitle>
            <DialogContentText>
                Please provide the following arguments
            </DialogContentText>

            <DialogContent>
                <Stack spacing={2}>
                    {splitArgStrings(func.metadata_expectedArgs)?.map((arg, i) => {
                        return <TextField
                            key={i}
                            label={arg.type ? `${arg.name} (${arg.type})` : arg.name}
                            helperText={arg.comment}
                            type={arg.type.includes("int") ? "number" : "text"}
                            onChange={(e) => setArgs(
                                [...args.slice(0, i), e.target.value, ...args.slice(i + 1)]
                            )}/>
                    })}
                </Stack>
            </DialogContent>

            <DialogContentText>
                {waitingForResponse &&
                    <Box display={"flex"} justifyContent={"center"}>
                        <CircularProgress/>
                        <Typography variant={"h5"}> Waiting for response...</Typography>
                    </Box>
                }
                {data?.functionCallCompleteds && data?.functionCallCompleteds?.length > 0
                    ?
                    <Typography>Response: {decodeResponse(response, err, func.metadata_expectedReturnType)}</Typography>
                    : <div/>
                }
                {errorMsg}
            </DialogContentText>
            <DialogActions>
                <Button variant={"contained"}
                        type={"submit"}
                        sx={{width: "100%", marginTop: 2}}
                        onClick={() => {
                            toast.info("Calling function with args " + args.join(", "))
                        }}>Submit</Button>
            </DialogActions>
        </form>

    </Dialog>)
}