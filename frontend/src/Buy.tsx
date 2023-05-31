// Drilldown page for an individual function
import React, {ReactNode, startTransition, useEffect, useState} from "react";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    List,
    ListItem,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {fallbackToJazzicon, jazziconImageString} from "./utils/util";
import {Link, useParams} from "react-router-dom";
import {generateSnippetString, SoliditySyntaxHighlighter, splitArgStrings} from "./Snippets";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {gql, useQuery} from "@apollo/client";
import {FunctionRegistered, Query} from "./gql/graphql";
import {
    BASE_FEE,
    decodeResponse,
    MUMBAI_CHAIN_ID,
    networkConfig,
    returnTypeEnumToString,
    SEPOLIA_CHAIN_ID,
    TypographyWithLinkIcon
} from "./common";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {AbiCoder, decodeBytes32String, formatEther, keccak256, parseEther, toUtf8Bytes} from "ethers";
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {toast} from "react-toastify";
import {useWeb3React} from "@web3-react/core";
import {useContract} from "./contractHooks";
import FunctionsManagerJson from "./generated/abi/FunctionsManager.json"
import LinkTokenJson from "./generated/abi/LinkTokenInterface.json"
import {FunctionsManager, LinkTokenInterface} from "./generated/contract-types";
import {JsonRpcProvider} from "@ethersproject/providers";
import {useFieldArray, useForm} from "react-hook-form";
import PublishIcon from '@mui/icons-material/Publish';

const DRILLDOWN_QUERY = gql`
    query DrilldownPage($functionId: ID!){
        functionRegistered(

            id: $functionId
        ){
            id
            functionId
            owner
            metadata_owner
            metadata_name
            metadata_desc
            metadata_imageUrl
            metadata_expectedArgs
            metadata_expectedReturnType
            metadata_category
            fee
            subId
        }
    }

`

const GridRow: React.FC<{ label: string, children: React.ReactNode }> = ({label, children}) => {
    return <Grid item container xs={12}>
        <Grid item xs={4} sm={3}>
            <Typography variant={"h6"}>{label}</Typography>
        </Grid>
        <Grid item xs={8} sm={9}>
            {children}
        </Grid>
    </Grid>
}

const GridRowTwoLines: React.FC<{ label: string, children: React.ReactNode }> = ({label, children}) => {
    return <Grid item container xs={12}>
        <Grid item xs={4} sm={3}>
            <Typography variant={"h6"}>{label}</Typography>
        </Grid>
        <Grid item xs={12} sx={{paddingLeft: 2}}>
            {children}
        </Grid>
    </Grid>
}

const GridRowTyp: React.FC<{ label: string, value?: string | number }> = ({label, value}) => {
    return <GridRow label={label}>
        <Typography variant={"body1"}>{value}</Typography>
    </GridRow>
}

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
const TryItNowModal: React.FC<{
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


// export const Buy: React.FC<{func: C
const InputSnippetGenerator: React.FC<{ func: FunctionRegistered, functionManagerAddress: string }> = ({
                                                                                                           func,
                                                                                                           functionManagerAddress
                                                                                                       }) => {
    const [hardcodeParameters, setHardcodeParameters] = React.useState(true);
    const [callbackFunction, setCallbackFunction] = React.useState("storeFull");
    const [returnRequestId, setReturnRequestId] = React.useState(true);
    const [customizeVisible, setCustomizeVisible] = React.useState(false);
    const snippetString = generateSnippetString(func, functionManagerAddress, {
        hardcodeParameters,
        callbackFunction,
        returnRequestId
    })

    const stackStyle = customizeVisible
        ? {border: 2, borderColor: "secondary.main", borderRadius: 1, padding: 2}
        : {}

    return (<Stack spacing={2}
                   sx={stackStyle}>
        {customizeVisible &&
            <Grid container xs={12} spacing={2}>
                <GridRow label={"Hard-code parameters"}>
                    <Button variant={hardcodeParameters ? "contained" : "outlined"}
                            onClick={() => setHardcodeParameters(true)}>Yes</Button>
                    <Button variant={!hardcodeParameters ? "contained" : "outlined"}
                            onClick={() => setHardcodeParameters(false)}>No</Button>
                </GridRow>
                <GridRow label={"Specify callback"}>
                    <Select value={callbackFunction} onChange={(e) => setCallbackFunction(e.target.value)}>
                        <MenuItem value={"storeFull"}>Store response, including full error</MenuItem>
                        <MenuItem value={"storePartial"}>Store response, with error as bool</MenuItem>
                        <MenuItem value={"doNothing"}>Do nothing</MenuItem>
                        <MenuItem value={"custom"}>Custom</MenuItem>
                    </Select>
                </GridRow>
                <GridRow label={"Return requestId"}>
                    <Button variant={returnRequestId ? "contained" : "outlined"}
                            onClick={() => setReturnRequestId(true)}>Yes</Button>
                    <Button variant={!returnRequestId ? "contained" : "outlined"}
                            onClick={() => setReturnRequestId(false)}>No</Button>
                </GridRow>
            </Grid>}

        <Paper sx={{width: "100%"}}>
            <Stack direction={"row"} spacing={1} width={"100%"} sx={{
                display: "flex",
                borderColor: "primary.main", border: 1, padding: 1
            }}>
                <Typography variant={"h6"}>Snippet</Typography>
                <Button style={{marginLeft: "auto"}}
                        variant={customizeVisible ? "contained" : "outlined"}
                        color={"secondary"}
                        startIcon={<EditIcon/>}
                        onClick={() => setCustomizeVisible(!customizeVisible)}
                        size={"small"}>customize</Button>
                <CopyToClipboard text={snippetString}>
                    <Button style={{justifySelf: "flex-end"}}
                            startIcon={<ContentCopyIcon/>}
                            variant={"contained"} color={"secondary"}
                            size={"small"}>Copy</Button>
                </CopyToClipboard>
            </Stack>
            <Box width={"100%"} sx={{
                display: "flex",
                borderColor: "primary.main", border: 1, borderTop: 0, padding: 1
            }}>
                <SoliditySyntaxHighlighter>
                    {snippetString}
                </SoliditySyntaxHighlighter>
            </Box>
        </Paper>
    </Stack>)
}

export const Buy: React.FC = () => {
    const {chainId, provider, account} = useWeb3React()
    const {functionId} = useParams<{ functionId: string }>();
    const [tryDialogOpen, setTryDialogOpen] = React.useState(false);
    const {loading, error, data} = useQuery<Query>(DRILLDOWN_QUERY, {
        variables: {
            functionId
        }
    });

    if (loading) return <Typography><CircularProgress/>Loading...</Typography>
    if (error) return <Typography>Error :( {error.message}</Typography>
    if (!data?.functionRegistered) return <Typography>Function not found</Typography>
    const func = data.functionRegistered;

    if (!chainId) {
        return <Typography>Could not get chain id from the connected wallet</Typography>
    } else if (chainId !== MUMBAI_CHAIN_ID && chainId !== SEPOLIA_CHAIN_ID) {
        return <Typography>Wrong chain id. Please connect to Mumbai or Sepolia</Typography>
    }


    const notify = () => toast.success("Copied ID to clipboard");

    return <Box width={{xs: "100%", sm: "100%", md: "80%", lg: "65%"}} margin={"auto"}>
        <Stack spacing={2} sx={{marginTop: 2}}>
            <img style={{maxWidth: 150, margin: "auto"}}
                 src={func.metadata_imageUrl || jazziconImageString(func.functionId)}
                 onError={(e) => fallbackToJazzicon(e, func.functionId)}/>
            <Typography variant={"h4"} color={"secondary"}
                        sx={{textAlign: "center", paddingLeft: 1, paddingRight: 1}}>{func.metadata_name}</Typography>
            <Stack direction={"row"} spacing={0.5} justifyContent={"center"} alignContent={"center"}
            >
                <Typography variant={"h6"} color={"greyscale40.main"}>
                    By:
                </Typography>
                <Typography variant={"h6"}>
                    <Link to={`/author/${func.owner}`}>CoinGecko
                    </Link>
                </Typography>
                {/*Link to scanner for mumbai */}
                <Tooltip title={"Open in scanner"}>
                    <Link to={networkConfig[chainId].getScannerAddressUrl(func.owner)}>
                        <Typography variant={"h6"}>{<OpenInNewIcon/>}</Typography>
                    </Link>
                </Tooltip>
            </Stack>

            <Box sx={{display: "flex", justifyContent: "center"}}>
                <Button
                    sx={{maxWidth: 300, minWidth: 200, textAlign: "center", margin: "auto"}}
                    startIcon={<PublishIcon/>}
                    variant={"contained"} color={"secondary"} onClick={() => setTryDialogOpen(true)}>
                    Try it now</Button>
            </Box>

            <TryItNowModal
                func={func}
                chainId={chainId}
                provider={provider}
                account={account}
                open={tryDialogOpen}
                setOpen={setTryDialogOpen}
            />

            <InputSnippetGenerator func={func}
                                   functionManagerAddress={networkConfig[chainId].functionsManager}/>
            <Paper sx={{
                width: "100%",
                display: "flex",
                borderColor: "primary.main", border: 1, padding: 1
            }}>
                <Grid container xs={12} spacing={1}>
                    <Grid item xs={12} sx={{borderBottom: 1, borderColor: "white"}}>
                        {/*<Grid item xs={12} sx={{borderBottom: 1, borderColor: "primary.main"}}>*/}
                        <Typography variant={"h6"}>Details</Typography>
                    </Grid>
                    <GridRow label={"Function ID"}>
                        <CopyToClipboard text={func.functionId} onCopy={notify}>
                            <Tooltip title={<Box>
                                <Typography>{func.functionId}</Typography>
                                <Typography>Click to copy to clipboard</Typography>
                            </Box>}>
                                <Typography sx={{overflow: "hidden", textOverflow: "ellipsis"}}
                                            variant={"body1"}>{func.functionId}</Typography>

                            </Tooltip>
                        </CopyToClipboard>
                    </GridRow>
                    <GridRowTyp label={"Description"} value={func.metadata_desc}/>
                    <GridRowTyp label={"Category"} value={decodeBytes32String(func.metadata_category)}/>
                    <GridRow label={"Fee"}>
                        <Box display={"flex"} flexDirection={"row"}>
                            <TypographyWithLinkIcon
                                variant={"body1"}>{formatEther(BigInt(func.fee) + BASE_FEE)}</TypographyWithLinkIcon>
                            <Typography>({formatEther(BASE_FEE)} base, {formatEther(func.fee)} premium)</Typography>
                        </Box>
                    </GridRow>

                    <GridRow label={"Arguments"}>
                        <List sx={{border: "1px solid white"}}>
                            {splitArgStrings(func.metadata_expectedArgs).map((arg, i) => {
                                return <ListItem key={i}>
                                    <Stack direction={"row"} spacing={2} padding={0}>
                                        <Typography variant={"body1"}
                                                    sx={{fontWeight: "bold"}}>{arg.name}</Typography>
                                        <Typography variant={"body1"}>{arg.type}</Typography>
                                    </Stack>
                                </ListItem>
                            })}
                        </List>
                        {/*<TableContainer>*/}
                        {/*    <Table*/}
                        {/*        sx={{width: "auto"}}>*/}
                        {/*        <TableHead>*/}
                        {/*            <TableRow>*/}
                        {/*                <TableCell>Name</TableCell>*/}
                        {/*                <TableCell>Type</TableCell>*/}
                        {/*                <TableCell>Desc</TableCell>*/}
                        {/*            </TableRow>*/}
                        {/*        </TableHead>*/}
                        {/*        <TableRow>*/}
                        {/*        </TableRow>*/}
                        {/*        <TableBody>*/}
                        {/*            {splitArgStrings(func.metadata_expectedArgs).map((arg, i) => {*/}
                        {/*                return <TableRow key={i}>*/}
                        {/*                    <TableCell>*/}
                        {/*                        <Typography variant={"body1"}*/}
                        {/*                                    sx={{fontWeight: "bold"}}>{arg.name}</Typography>*/}
                        {/*                    </TableCell>*/}
                        {/*                    <TableCell>*/}
                        {/*                        <Typography variant={"body1"}>{arg.type}</Typography>*/}
                        {/*                    </TableCell>*/}
                        {/*                    <TableCell>*/}
                        {/*                        <Typography variant={"body1"}>{arg.comment}</Typography>*/}
                        {/*                    </TableCell>*/}
                        {/*                </TableRow>*/}
                        {/*            })}*/}
                        {/*        </TableBody>*/}
                        {/*    </Table>*/}
                        {/*</TableContainer>*/}
                    </GridRow>
                    <GridRow label={"Return type"}>
                        <Typography variant={"body1"}>
                            {func.metadata_expectedReturnType || "?"} - {returnTypeEnumToString(func.metadata_expectedReturnType)}
                        </Typography>
                    </GridRow>
                </Grid>
            </Paper>
        </Stack>
    </Box>
}

export default Buy;


