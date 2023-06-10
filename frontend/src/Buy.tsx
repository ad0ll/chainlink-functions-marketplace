// Drilldown page for an individual function
import React, {startTransition, useContext, useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import {generateSnippetString, SoliditySyntaxHighlighter, splitArgStrings} from "./Snippets";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {gql, useQuery} from "@apollo/client";
import {
    blockTimestampToDate,
    codeLanguageToStrong,
    codeLocationToString,
    CombinedFunctionMetadata,
    decodeResponse,
    mergeFunctionMetadataAndExecMetadata,
    OutcomeCell,
    returnTypeEnumToString,
    TypographyWithLinkIcon
} from "./common";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {BigNumberish, decodeBytes32String, ethers, formatEther, parseUnits} from "ethers";
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {toast} from "react-toastify";
import PublishIcon from '@mui/icons-material/Publish';
import {FunctionsBillingRegistryInterface, FunctionsManager} from "./generated/contract-types";
import LinkTokenIcon from "./assets/icons/link-token-blue.svg";
import {AddressCard} from "./Cards";
import {FunctionsManagerContext} from "./FunctionsManagerProvider";
import {addressToJazziconSeed, fallbackToJazzicon, jazziconImageString, truncateIfAddress} from "./utils/util";
import {TryItNowModal} from "./TryItNowModal";
import Jazzicon from "./Jazzicon";


const GridRow: React.FC<{ label: string, children: React.ReactNode, valueFirst?: boolean }> = ({
                                                                                                   label,
                                                                                                   children,
                                                                                                   valueFirst = false
                                                                                               }) => {

    const l = <Typography variant={"h6"}>{label}</Typography>
    return <Grid item container>
        <Grid item xs={5} sm={4}>
            {valueFirst ? children : l}
        </Grid>
        <Grid item xs={7} sm={8}>
            {valueFirst ? l : children}
        </Grid>
    </Grid>
}

const GridRowTyp: React.FC<{ label: string, value?: string | number }> = ({label, value}) => {
    return <GridRow label={label}>
        <Typography variant={"body1"}>{value}</Typography>
    </GridRow>
}

const MetricsCards: React.FC<{ functionId: string }> = ({functionId}) => {
    const {functionsManager} = useContext(FunctionsManagerContext)

    const [meta, setMeta] = React.useState<Partial<FunctionsManager.FunctionExecuteMetadataStruct>>()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const meta = await functionsManager.getFunctionExecuteMetadata(functionId)
                setMeta({
                    functionsCalledCount: meta.functionsCalledCount,
                    totalFeesCollected: meta.totalFeesCollected,
                    successfulResponseCount: meta.successfulResponseCount,
                    failedResponseCount: meta.failedResponseCount,
                })
            } catch (e: any) {
                console.log("Enconteered error fetching execution metadata", e)
                return
            }

        }
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => {
            clearInterval(interval);
        };
    }, []); // Empty dependency array to run the effect only once

    const {totalFeesCollected, functionsCalledCount, successfulResponseCount, failedResponseCount} = meta || {}
    if (totalFeesCollected === undefined || functionsCalledCount === undefined || successfulResponseCount === undefined || failedResponseCount === undefined) {
        return <>Missing Metadata</>
    }
    const failurePercent = BigInt(functionsCalledCount) > 0n
        ? ((BigInt(failedResponseCount) * 100n) / BigInt(functionsCalledCount))
        : 0n
    const successPercent = BigInt(functionsCalledCount) > 0n
        ? ((BigInt(successfulResponseCount) * 100n) / BigInt(functionsCalledCount))
        : 0n
    console.log(meta)
    console.log("functionsCalledCount", functionsCalledCount, "successfulResponseCount", successfulResponseCount, "failedResponseCount", failedResponseCount, "successPercent", successPercent, "failurePercent", failurePercent)
    return (<Grid container spacing={2}>
        <Grid item xs={6}>
            <Card elevation={4}
                  sx={{
                      borderRadius: 2,
                      padding: 2
                  }}
            >
                <Stack spacing={1}>
                    <Typography variant={"h4"} textAlign={"center"}>Lifetime Calls</Typography>
                    {BigInt(functionsCalledCount) > 0n ? <Box display={"flex"}>
                            <Box sx={{backgroundColor: "#31ff87", borderBottomRightRadius: 2, borderTopRightRadius: 2}}
                                 width={`${successPercent * 100n}%`}
                                 height={25}></Box>
                            <Box sx={{backgroundColor: "#ff3131", borderBottomLeftRadius: 2, borderTopLeftRadius: 2}}
                                 width={`${failurePercent * 100n}%`}
                                 height={25}></Box>
                        </Box>
                        : <Box sx={{
                            border: "1px solid white",
                            borderBottomRightRadius: 2,
                            borderTopRightRadius: 2,
                            textAlign: "center"
                        }}
                               width={`100%`}
                               height={25}>?</Box>}
                    <Box display={"flex"} justifyContent={"space-between"}>
                        <Box sx={{color: "#31ff87"}}>
                            <Typography variant={"h5"}
                                        sx={{
                                            textAlign: "center",
                                        }}>{BigInt(successfulResponseCount).toString()}</Typography>
                            <Typography variant={"h6"}>
                                Success
                            </Typography>
                        </Box>
                        <Box sx={{color: "#ff3131"}}>
                            <Typography variant={"h5"}
                                        sx={{textAlign: "center"}}>{BigInt(failedResponseCount).toString()}</Typography>
                            <Typography variant={"h6"}>
                                Failed
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </Card>
        </Grid>
        <Grid item xs={6}>
            <Card elevation={4}
                  sx={{
                      borderRadius: 2,
                      padding: 2,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column"
                  }}
            >
                <Typography variant={"h4"} textAlign={"center"}>
                    Lifetime Earnings
                </Typography>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "80%",
                }}>
                    <Typography variant={"h3"}
                                sx={{marginRight: 3}}>
                        <LinkTokenIcon height={36}
                                       width={36}
                                       style={{marginRight: 8}}/>
                        {ethers.formatUnits(BigInt(totalFeesCollected) - (BigInt(totalFeesCollected) % (10n ** 16n)), "ether")}
                    </Typography>
                </Box>
            </Card>
        </Grid>
    </Grid>)
}
const FUNCTION_CALL_HISTORY_QUERY = gql`
    query FunctionCallHistory($functionId: Bytes!){
        functionCalleds(
            first: 10,
            skip: 0,
            where: {
                functionId: $functionId
            },
            orderDirection: desc
            orderBy: blockTimestamp
        ){
            requestId
            caller
            baseFee
            fee
            blockTimestamp
            transactionHash
        }
    }`
const OutcomeCellFetch: React.FC<{ requestId: string }> = ({
                                                               requestId,
                                                           }) => {
    const {functionsManager} = useContext(FunctionsManagerContext)
    const [functionResponse, setFunctionResponse] = React.useState<FunctionsManager.FunctionResponseStruct>()

    useEffect(() => {
        const fetchData = async () => {
            if (functionResponse && (functionResponse.err || functionResponse.response)) return //Stop polling when confirmed
            try {
                const outcome = await functionsManager.getFunctionResponse(requestId)
                setFunctionResponse(outcome)
            } catch (e: any) {
                console.log("Encountered error fetching function response", e)
            }
        }
        fetchData()
        const interval = setInterval(fetchData, 2000);
        return () => {
            clearInterval(interval);
        };
    }, []);


    return <>
        <OutcomeCell functionResponse={functionResponse}/>
    </>
}
const DetailsDialog: React.FC<{
    requestId: string,
    transactionHash: string,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    expectedReturnType: BigNumberish //TODO drop this later
}> = ({
          requestId,
          open,
          setOpen,
          expectedReturnType,
          transactionHash
      }) => {
    const {functionsManager, networkConfig} = useContext(FunctionsManagerContext)
    const [functionResponse, setFunctionResponse] = React.useState<FunctionsManager.FunctionResponseStruct>()
    useEffect(() => {
        if (!open) return

        const fetchData = async () => {
            // if (functionResponse && (functionResponse.err || functionResponse.response)) return//Stop polling when confirmed
            console.log("Fetching data", requestId)
            try {
                const outcome = await functionsManager.getFunctionResponse(requestId)
                console.log("outcome", outcome)
                setFunctionResponse(outcome)
            } catch (e: any) {
                console.log("Encountered error fetching function response (detail dialog)", e)
            }
        }
        fetchData()
        const interval = setInterval(fetchData, 2000);
        return () => {
            clearInterval(interval);
        };
    }, [open, requestId]);


    const hasResponse = (functionResponse?.response && functionResponse.response !== "0x") || (functionResponse?.err && functionResponse.err !== "0x")

    // if (!hasResponse) return <CircularProgress></CircularProgress>
    if (!requestId) return <></>
    return <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Outcome
            for {requestId?.slice(0, 6) + "..." + requestId?.slice(requestId.length - 4, requestId.length)}</DialogTitle>
        <DialogContent>
            <Stack spacing={2}>
                <Grid container>
                    <Grid item xs={4}>Request ID</Grid>
                    <Grid item xs={8}>
                        {/*<Tooltip title={"Click to copy"}>*/}
                        {/*    <CopyToClipboard text={requestId.toString() || ""}>*/}
                        <Typography sx={{overflow: "hidden", textOverflow: "ellipsis"}}>
                            {requestId}
                        </Typography>
                        {/*</CopyToClipboard>*/}
                        {/*</Tooltip>*/}
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={4}>Transaction Hash</Grid>
                    <Grid item xs={8}>
                        <Tooltip title={"View in scanner"}>
                            {/*            <CopyToClipboard text={transactionHash}>*/}
                            <a href={networkConfig?.getScannerTxUrl(transactionHash)} target={"_blank"}>
                                <Typography sx={{overflow: "hidden", textOverflow: "ellipsis"}}>
                                    {transactionHash}
                                </Typography>
                            </a>
                            {/*            </CopyToClipboard>*/}
                        </Tooltip>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={4}>Args</Grid>
                    <Grid item xs={8}>
                        {functionResponse?.args?.join(", ")}
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={4}>Outcome</Grid>
                    <OutcomeCell functionResponse={functionResponse}/>
                </Grid>
                <Grid container>
                    <Grid item xs={4}>Response</Grid>
                    <Grid item xs={8}>
                        {hasResponse && decodeResponse(functionResponse?.response?.toString(), functionResponse?.err?.toString(), expectedReturnType.valueOf())}
                    </Grid>
                </Grid>
                {/*<Grid container>*/}
                {/*    <Grid item>*/}
                {/*        <a href={networkConfig?.getScannerTxUrl(transactionHash)}>*/}
                {/*            <Button variant={"outlined"} startIcon={<OpenInNewIcon/>}>View transaction in*/}
                {/*                scanner</Button>*/}
                {/*        </a>*/}
                {/*    </Grid>*/}
                {/*</Grid>*/}
            </Stack>
        </DialogContent>
    </Dialog>
}

const ExecutionTable: React.FC<{ functionId: string, expectedReturnType: BigNumberish }> = ({
                                                                                                functionId,
                                                                                                expectedReturnType
                                                                                            }) => {

    const [showModal, setShowModal] = React.useState(false)
    const {loading, error, data} = useQuery(FUNCTION_CALL_HISTORY_QUERY, {
        variables: {
            functionId
        },
        pollInterval: 1000
    });
    const [selectedRequestId, setSelectedRequestId] = React.useState<string>("")
    const [selectedTransactionHash, setSelectedTransactionHash] = React.useState<string>("")
    const [outcomeDialogOpen, setOutcomeDialogOpen] = React.useState(false)

    if (loading) return <Typography><CircularProgress/>Loading...</Typography>;
    if (error) {
        console.log(error)
        return <Typography>Error fetching data</Typography>;
    }
    if (!data.functionCalleds || data.functionCalleds.length === 0) {
        return <Paper sx={{padding: 2}}>
            <Typography variant={"h5"}>No execution history found</Typography>
        </Paper>
    }

    return (<TableContainer component={Paper} sx={{
        borderColor: "primary.main",
        border: 1,
    }}>
        <Typography width={"100%"} sx={{borderBottom: 1, borderColor: "white", padding: 1}} variant={"h6"}>Execution
            history</Typography>

        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><Typography>Request ID</Typography></TableCell>
                    <TableCell><Typography>Caller</Typography></TableCell>
                    {/*<TableCell><Typography>Fee</Typography></TableCell>*/}
                    <TableCell><Typography>Outcome</Typography></TableCell>
                    <TableCell><Typography>Called on</Typography></TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.functionCalleds.map((row: any) => {
                    return <TableRow key={row.requestId}>
                        <TableCell>{row.requestId?.slice(0, 6) + "..." + row.requestId?.slice(row.requestId.length - 4, row.requestId.length)}</TableCell>
                        <TableCell><AddressCard addr={row.caller}/></TableCell>
                        <TableCell><OutcomeCellFetch requestId={row.requestId}/></TableCell>
                        <TableCell><Typography>{blockTimestampToDate(row.blockTimestamp)}</Typography></TableCell>
                        <TableCell>
                            <Button onClick={() => {
                                startTransition(() => {
                                    setSelectedRequestId(row.requestId)
                                    setSelectedTransactionHash(row.transactionHash)
                                    setOutcomeDialogOpen(true)
                                })
                            }}>Details</Button>
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
        <DetailsDialog
            requestId={selectedRequestId}
            open={outcomeDialogOpen}
            transactionHash={selectedTransactionHash}
            setOpen={setOutcomeDialogOpen}
            expectedReturnType={expectedReturnType}/>
    </TableContainer>)
}


const InputSnippetGenerator: React.FC<{
    func: CombinedFunctionMetadata,
    functionManagerAddress: string
}> = ({
          func,
      }) => {
    const [hardcodeParameters, setHardcodeParameters] = React.useState(true);
    const [inlineInterfaces, setInlineInterfaces] = React.useState(true);
    const [hardcodeAddresses, setHardcodeAddresses] = React.useState(true);
    const [makeGeneric, setMakeGeneric] = React.useState(false);
    const [allowDeposit, setAllowDeposit] = React.useState(false);
    const [customizeVisible, setCustomizeVisible] = React.useState(false);
    const snippetString = generateSnippetString(func, {
        hardcodeParameters,
        inlineInterfaces,
        hardcodeAddresses,
        makeGeneric,
        allowDeposit
    })

    const stackStyle = customizeVisible
        ? {border: 2, borderColor: "secondary.main", borderRadius: 1, padding: 2}
        : {}

    return (<Stack spacing={2}
                   sx={stackStyle}>
        {customizeVisible &&
            <Grid container xs={12} spacing={2}>
                <GridRow label={"Use inline interfaces"} valueFirst={true}>
                    <Button variant={inlineInterfaces ? "contained" : "outlined"}
                            onClick={() => setInlineInterfaces(true)}>Yes</Button>
                    <Button variant={!inlineInterfaces ? "contained" : "outlined"}
                            onClick={() => setInlineInterfaces(false)}>No</Button>
                </GridRow>
                <GridRow label={"Hard-code parameters"} valueFirst={true}>
                    <Button variant={hardcodeParameters ? "contained" : "outlined"}
                            onClick={() => setHardcodeParameters(true)}>Yes</Button>
                    <Button variant={!hardcodeParameters ? "contained" : "outlined"}
                            onClick={() => setHardcodeParameters(false)}>No</Button>
                </GridRow>
                <GridRow label={"Hard-code addresses"} valueFirst={true}>
                    <Button variant={hardcodeAddresses ? "contained" : "outlined"}
                            onClick={() => setHardcodeAddresses(true)}>Yes</Button>
                    <Button variant={!hardcodeAddresses ? "contained" : "outlined"}
                            onClick={() => setHardcodeAddresses(false)}>No</Button>
                </GridRow>
                <GridRow label={"Allow deposits"} valueFirst={true}>
                    <Button variant={allowDeposit ? "contained" : "outlined"}
                            onClick={() => setAllowDeposit(true)}>Yes</Button>
                    <Button variant={!allowDeposit ? "contained" : "outlined"}
                            onClick={() => setAllowDeposit(false)}>No</Button>
                </GridRow>
                <GridRow label={"Make contract generic"} valueFirst={true}>
                    <Button variant={makeGeneric ? "contained" : "outlined"}
                            onClick={() => setMakeGeneric(true)}>Yes</Button>
                    <Button variant={!makeGeneric ? "contained" : "outlined"}
                            onClick={() => setMakeGeneric(false)}>No</Button>
                </GridRow>
            </Grid>}


        <Paper sx={{width: "100%"}}>
            <Stack direction={"row"} spacing={1} width={"100%"} sx={{
                display: "flex",
                borderColor: "primary.main", border: 1, padding: 1
            }}>
                <Typography variant={"h6"}>Example Contract</Typography>
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
    const {networkConfig, functionsManager, functionsBillingRegistry} = useContext(FunctionsManagerContext)
    const {functionId} = useParams<{ functionId: string }>();
    if (!functionId) return <Typography>Function not found</Typography>
    const [tryDialogOpen, setTryDialogOpen] = React.useState(false);
    const [func, setFunc] = React.useState<CombinedFunctionMetadata | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [baseFee, setBaseFee] = useState<bigint>(0n)

    useEffect(() => {
        if (!functionId) return;
        const fetchData = async () => {
            try {
                // const [f, fe] = await functionsManagerContract.getAllFunctionMetadata(functionId);

                console.log("FunctionId", functionId)
                const presentationMeta = await functionsManager.getFunctionMetadata(functionId);
                const executionMeta = await functionsManager.getFunctionExecuteMetadata(functionId);
                if (!presentationMeta) return;
                const requestBilling: FunctionsBillingRegistryInterface.RequestBillingStruct = {
                    subscriptionId: executionMeta.subId,
                    client: presentationMeta.owner,
                    gasLimit: 300_000,
                    gasPrice: parseUnits("30", "gwei")
                }

                const baseFee = await functionsBillingRegistry.getRequiredFee("0x", requestBilling)

                startTransition(() => {
                    setFunc(mergeFunctionMetadataAndExecMetadata(presentationMeta, executionMeta))
                    setBaseFee(baseFee)
                    setLoading(false)
                })
            } catch (e: any) {
                console.error("Drilldown fetchData", e)
            }
        }
        fetchData();
    }, [functionId]);

    if (loading) return <Typography><CircularProgress/>Loading...</Typography>
    if (!func) return <Typography>Function not found</Typography>
    console.log("func", func)
    return (<Box width={{xs: "100%", sm: "100%", md: "80%", lg: "65%"}} margin={"auto"}>
            <Stack spacing={2} sx={{marginTop: 2}}>
                <img style={{maxWidth: 150, margin: "auto"}}
                     src={func?.imageUrl || jazziconImageString(functionId)}
                     onError={(e) => fallbackToJazzicon(e, functionId)}/>
                <Typography variant={"h4"} color={"secondary"}
                            sx={{textAlign: "center", paddingLeft: 1, paddingRight: 1}}>{func.name}</Typography>
                <Stack direction={"row"} spacing={0.5} justifyContent={"center"} alignContent={"center"}
                >
                    <Typography variant={"h6"} color={"greyscale40.main"}>
                        By:
                    </Typography>
                    <Typography variant={"h6"}>
                        <Link to={`/author/${func.owner}`}>{truncateIfAddress(func.owner.toString())}
                        </Link>
                    </Typography>
                    {/*Link to scanner for mumbai */}
                    <Tooltip title={"Open in scanner"}>
                        <Link to={networkConfig.getScannerAddressUrl(func?.owner.toString())}>
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
                    open={tryDialogOpen}
                    setOpen={setTryDialogOpen}
                />

                <MetricsCards functionId={func.functionId.toString()}/>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <InputSnippetGenerator func={func}
                                               functionManagerAddress={networkConfig.functionsManager}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{
                            width: "100%",
                            display: "flex",
                            borderColor: "primary.main", border: 1, padding: 1
                        }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sx={{borderBottom: 1, borderColor: "white"}}>
                                    {/*<Grid item xs={12} sx={{borderBottom: 1, borderColor: "primary.main"}}>*/}
                                    <Typography variant={"h6"}>Details</Typography>
                                </Grid>
                                <GridRow label={"Function ID"}>
                                    <CopyToClipboard text={functionId} onCopy={() => {
                                        toast.success("Copied ID to clipboard")
                                    }}>
                                        <Tooltip title={<Box>
                                            <Typography>{functionId}</Typography>
                                            <Typography>Click to copy to clipboard</Typography>
                                        </Box>}>
                                            <Typography sx={{overflow: "hidden", textOverflow: "ellipsis"}}
                                                        variant={"body1"}>{functionId}</Typography>
                                        </Tooltip>
                                    </CopyToClipboard>
                                </GridRow>
                                <GridRow label={"Owner"}>
                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                        <Jazzicon seed={addressToJazziconSeed(func.owner.toString())}
                                                  style={{height: 20, marginRight: 8}}/>
                                        <Link to={`/author/${func.owner}`}>
                                            <Typography>
                                                {func.owner.toString()}
                                            </Typography>
                                        </Link>
                                    </Box>
                                </GridRow>
                                <GridRowTyp label={"Name"} value={func.name}/>
                                <GridRowTyp label={"Description"} value={func.desc}/>
                                <GridRowTyp label={"Category"} value={decodeBytes32String(func.category)}/>
                                <GridRow label={"Fee"}>
                                    <Box display={"flex"} flexDirection={"row"}>
                                        <TypographyWithLinkIcon
                                            variant={"body1"}>{formatEther(BigInt(func.fee) + baseFee)}</TypographyWithLinkIcon>
                                        <Typography>({formatEther(baseFee)} base, {formatEther(func.fee)} premium)</Typography>
                                    </Box>
                                </GridRow>
                                <GridRowTyp label={"Code Location"} value={codeLocationToString(func.codeLocation)}/>
                                <GridRowTyp label={"Code Language"} value={codeLanguageToStrong(func.language)}/>
                                <GridRow label={"Return type"}>
                                    <Typography variant={"body1"}>
                                        {returnTypeEnumToString(1)} (Raw
                                        value: {1})
                                    </Typography>
                                </GridRow>
                                <GridRow label={"Arguments"}>
                                    <Typography>
                                        {splitArgStrings(func?.expectedArgs).map((arg, i) => {
                                            return `${arg.name} (${arg.type})`
                                        }).join(", ")}
                                    </Typography>
                                </GridRow>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <ExecutionTable functionId={func.functionId.toString()} expectedReturnType={1}/>
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    )
}

export default Buy;


