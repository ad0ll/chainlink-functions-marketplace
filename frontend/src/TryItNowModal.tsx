/*
The try it now modal appears on the home page and the buy page.
It makes a raw request to the FunctionsManager contract for a given function, and then polls for the response.
It also checks if the user is allowed to transfer LINK to the functions manager and starts an approval tx if they aren't
*/
import React, {ReactNode, startTransition, useContext, useEffect, useState} from "react";
import {CombinedFunctionMetadata, decodeResponse} from "./common";
import {useContract} from "./contractHooks";
import {FunctionsManager, LinkTokenInterface} from "./generated/contract-types";
import LinkTokenJson from "./generated/abi/LinkTokenInterface.json";
import {useFieldArray, useForm} from "react-hook-form";
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
import {splitArgStrings} from "./ContractGenerator";
import {FunctionsManagerContext} from "./FunctionsManagerProvider";


type FormValues = {
    args: {
        value: string
    }[]
}


export const TryItNowModal: React.FC<{
    func?: CombinedFunctionMetadata,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({func, open, setOpen}) => {
    const {networkConfig, account, provider, functionsManager} = useContext(FunctionsManagerContext);
    const [args, setArgs] = useState<string[]>([]);
    const [requestId, setRequestId] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<ReactNode>(<div/>);
    const linkTokenContract = useContract(networkConfig.linkToken, LinkTokenJson.abi) as unknown as LinkTokenInterface
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const [functionResponse, setFunctionResponse] = useState<FunctionsManager.FunctionResponseStruct>();
    const [statusText, setStatusText] = useState<string>("");
    const {register, handleSubmit, getValues, setValue, watch, formState, control} = useForm<FormValues>();
    const {fields, insert, remove} = useFieldArray({
        name: "args", // Specify the name of the array field
        control,
    });

    const onSubmit = handleSubmit(async (data) => {
        if (!func) return
        setRequestId("")
        let allowance = await linkTokenContract.allowance(account, networkConfig.functionsManager)
        if (allowance < parseEther("1")) {
            toast.info("Your account is not authorized to transfer LINK to the FunctionsManager. Please authorize this transaction to approve LINK transfers.")
            try {
                setStatusText("Approving LINK transfers...")
                setWaitingForResponse(true)
                let approveTx = await linkTokenContract.approve(networkConfig.functionsManager, parseEther("1"))

                setStatusText("Approving LINK transfers...")

                let approveReceipt = await provider?.waitForTransaction(approveTx.hash, 1)
                if (approveReceipt?.status !== 1) {
                    toast.error("Failed to approve LINK transfers, please try again")
                    return
                }
                toast.success("Successfully approved LINK transfers")
                setWaitingForResponse(false)
            } catch (e: any) {
                console.log("encountered error running approve", e);
                setWaitingForResponse(false);
                setErrorMsg("Failed to approve LINK transfers, please try again");
                return
            }
        }

        try {
            setStatusText("Executing function...")
            const execTx = await functionsManager.executeRequest(func.functionId, args, {gasLimit: 2_000_000});
            setWaitingForResponse(true)
            setStatusText("Waiting for transaction to be mined...")
            const execReceipt = await provider?.waitForTransaction(execTx.hash, 1);
            if (execReceipt?.status !== 1) {
                setErrorMsg(<Typography variant={"body1"} color={"error"}>Transaction failed,
                    <a href={`${networkConfig.getScannerTxUrl(execTx.hash)}`} target="_blank">
                        View transaction in scanner for details...
                    </a></Typography>)
            }
            console.log("execReceipt", execReceipt)

            //Scrape for raw signature because ethers bug: https://github.com/ethers-io/ethers.js/issues/3830
            const sig = keccak256(toUtf8Bytes("FunctionCalled(bytes32,bytes32,address,address,bytes32,uint96,uint96,uint96,string[])"))
            setStatusText("Scraping logs for request id...")
            const reqIdLoc = execReceipt?.logs?.find((e) => e.topics[0] === sig)
            if (!reqIdLoc) {
                setStatusText("")
                setWaitingForResponse(false)
                toast.error("Failed to get requestId from transaction logs")
                return
            }

            console.log("reqIdLoc", reqIdLoc)
            const requestId = await AbiCoder.defaultAbiCoder().decode(["bytes32"], reqIdLoc.topics[2])
            console.log("requestId", requestId)

            toast.success("Successfully sent request, waiting for response...")
            startTransition(() => {
                setRequestId(requestId[0])
                setErrorMsg("")
                setStatusText("Waiting for response...")
                setWaitingForResponse(true)
            })
        } catch (e: any) {
            console.log("encountered error running executeRequest", e)
        }
    })

    useEffect(() => {
        console.log("useEffect requestId", requestId
            , "waitingForResponse", waitingForResponse)
        if (!waitingForResponse || !requestId) return
        const fetchData = async () => {
            try {
                if (functionResponse && ((functionResponse.err && functionResponse.err !== "0x") || (functionResponse.response && functionResponse.response !== "0x"))) return //Stop polling when confirmed
                const outcome = await functionsManager.getFunctionResponse(requestId)
                console.log("outcome", outcome)
                if ((outcome.err && outcome.err !== "0x") || (outcome.response && outcome.response !== "0x")) {
                    startTransition(() => {
                        setFunctionResponse(outcome)
                        setWaitingForResponse(false)
                    })
                }
            } catch (e: any) {
                console.log("getFunctinResponse", e.message)
                return
            }
        }
        fetchData()
        const interval = setInterval(fetchData, 500);
        return () => {
            clearInterval(interval);
        };
    }, [requestId, waitingForResponse]);


    if (!func) return <div/>
    console.log("functionResponse", functionResponse)
    return (<Dialog open={open} onClose={() => setOpen(false)} sx={{padding: 2}}>
        <form onSubmit={onSubmit} style={{padding: 16, minWidth: 500}}>
            <DialogTitle>Try {func.name}</DialogTitle>
            <DialogContentText>
                Please provide the following arguments
            </DialogContentText>

            <DialogContent>
                <Stack spacing={2}>
                    {splitArgStrings(func.expectedArgs)?.map((arg, i) => {
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
                {waitingForResponse ?
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <CircularProgress sx={{marginRight: 1}}/>
                        <Typography variant={"h5"}>
                            {statusText}</Typography>
                    </Box>
                    : <div/>
                }
                {(functionResponse?.response && functionResponse.response !== "0x") || (functionResponse?.err && functionResponse.err !== "0x")
                    ? <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <Typography
                            variant={"h5"}>Response: {decodeResponse(functionResponse?.response.toString() || "", functionResponse?.err.toString() || "", func.expectedReturnType)}</Typography>
                    </Box>
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