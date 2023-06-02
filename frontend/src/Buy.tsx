// Drilldown page for an individual function
import React, {ReactNode, startTransition, useContext, useEffect} from "react";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    List,
    ListItem,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
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
    blockTimestampToDate,
    decodeResponse,
    networkConfig,
    returnTypeEnumToString,
    TypographyWithLinkIcon
} from "./common";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {decodeBytes32String, ethers, formatEther} from "ethers";
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {toast} from "react-toastify";
import PublishIcon from '@mui/icons-material/Publish';
import {TryItNowModal} from "./TryItNowModal";
import {FunctionsManager} from "./generated/contract-types";
import LinkTokenIcon from "./assets/icons/link-token-blue.svg";
import {AddressCard} from "./Cards";
import {FunctionsManagerContext} from "./FunctionsManagerProvider";


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

const GridRow: React.FC<{ label: string, children: React.ReactNode, valueFirst?: boolean }> = ({
                                                                                                   label,
                                                                                                   children,
                                                                                                   valueFirst = false
                                                                                               }) => {

    const l = <Typography variant={"h6"}>{label}</Typography>
    return <Grid item container xs={12}>
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
    const {functionsManagerContract} = useContext(FunctionsManagerContext)

    const [meta, setMeta] = React.useState<Partial<FunctionsManager.FunctionExecuteMetadataStruct>>()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const meta = await functionsManagerContract.getFunctionExecuteMetadata(functionId)
                setMeta({
                    functionsCalledCount: meta.functionsCalledCount,
                    totalFeesCollected: meta.totalFeesCollected,
                    successfulResponseCount: meta.successfulResponseCount,
                    failedResponseCount: meta.failedResponseCount,
                })
            } catch (e: any) {
                console.log("Enconteered error fetching execution metadata", e)
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
        ? (BigInt(failedResponseCount) / BigInt(functionsCalledCount)) * 100n
        : 0n
    const successPercent = BigInt(functionsCalledCount) > 0n
        ? (BigInt(successfulResponseCount) / BigInt(functionsCalledCount)) * 100n
        : 0n

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
                                Successful
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

const OutcomeCellText: React.FC<{ text: string, color: string }> = ({text, color}) => {
    return <Typography
        sx={{
            border: "1px solid " + color,
            padding: 0.5,
            color: color,
            textAlign: "center",
            borderRadius: 1.5,
            maxWidth: 100
        }}
    >{text}</Typography>
}
const OutcomeCell: React.FC<{ requestId: string }> = ({
                                                          requestId,
                                                      }) => {
    const {functionsManagerContract} = useContext(FunctionsManagerContext)
    const [functionResponse, setFunctionResponse] = React.useState<FunctionsManager.FunctionResponseStruct>()

    useEffect(() => {
        const fetchData = async () => {
            if (functionResponse && (functionResponse.err || functionResponse.response)) return //Stop polling when confirmed
            try {
                const outcome = await functionsManagerContract.getFunctionResponse(requestId)
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


    let cell: ReactNode = <OutcomeCellText color={"grey"} text={"UNKNOWN"}/>;
    if (!functionResponse) {
        cell = <OutcomeCellText color={"grey"} text={"PENDING"}/>
    } else if (functionResponse.err) {
        cell = <OutcomeCellText color={"#ff3131"} text={"ERROR"}/>
    } else if (functionResponse.response) (
        cell = <OutcomeCellText color={"#31ff87"} text={"SUCCESS"}/>
    )

    return <>
        {cell}
    </>
}
const DetailsDialog: React.FC<{
    requestId: string,
    transactionHash: string,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    expectedReturnType: 0 | 1 | 2 | 3 //TODO drop this later
}> = ({
          requestId,
          open,
          setOpen,
          expectedReturnType,
          transactionHash
      }) => {
    const {functionsManagerContract, networkConfig} = useContext(FunctionsManagerContext)
    const [functionResponse, setFunctionResponse] = React.useState<FunctionsManager.FunctionResponseStruct>()
    useEffect(() => {
        if (!open) return

        const fetchData = async () => {
            // if (functionResponse && (functionResponse.err || functionResponse.response)) return//Stop polling when confirmed
            console.log("Fetching data")
            try {
                const outcome = await functionsManagerContract.getFunctionResponse(requestId)
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

    let color: string = "grey";
    let text: string = "PENDING";
    const hasResponse = functionResponse?.response || functionResponse?.err
    if (functionResponse?.err) {
        color = "red"
        text = "ERROR"
    } else if (functionResponse?.response) {
        color = "green"
        text = "SUCCESS"
    }


    return <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Outcome
            for {requestId?.slice(0, 6) + "..." + requestId?.slice(requestId.length - 4, requestId.length)}</DialogTitle>
        <DialogContent>
            <Stack spacing={2}>
                <Grid container>
                    <Grid item xs={4}>Request ID</Grid>
                    <Grid item xs={8}>{requestId}</Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={4}>Response</Grid>
                    <Grid item xs={8}>
                        {hasResponse && decodeResponse(functionResponse?.response?.toString(), functionResponse?.err?.toString(), expectedReturnType)}
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={4}>Outcome</Grid>
                    <OutcomeCellText text={text} color={color}/>
                </Grid>
                <Grid container>
                    <Grid item>
                        <a href={networkConfig?.getScannerTxUrl(transactionHash)}>
                            <Button variant={"outlined"} startIcon={<OpenInNewIcon/>}>View transaction in
                                scanner</Button>
                        </a>
                    </Grid>
                </Grid>
            </Stack>
        </DialogContent>
    </Dialog>
}

const ExecutionTable: React.FC<{ functionId: string }> = ({functionId}) => {

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

    return (<Paper sx={{
        width: "100%",
        display: "flex",
        borderColor: "primary.main",
        border: 1,
        padding: 1
    }}>
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
                        <TableCell><OutcomeCell requestId={row.requestId}/></TableCell>
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
            expectedReturnType={3}/>
    </Paper>)
}


const InputSnippetGenerator: React.FC<{ func: FunctionRegistered, functionManagerAddress: string }> = ({
                                                                                                           func,
                                                                                                       }) => {
    const [hardcodeParameters, setHardcodeParameters] = React.useState(true);
    const [callbackFunction, setCallbackFunction] = React.useState("storeFull");
    const [returnRequestId, setReturnRequestId] = React.useState(true);
    const [customizeVisible, setCustomizeVisible] = React.useState(false);
    const [useInterface, setUseInterface] = React.useState(false);
    const snippetString = generateSnippetString(func, {
        hardcodeParameters,
        callbackFunction,
        returnRequestId,
        useInterface
    })

    const stackStyle = customizeVisible
        ? {border: 2, borderColor: "secondary.main", borderRadius: 1, padding: 2}
        : {}

    return (<Stack spacing={2}
                   sx={stackStyle}>
        {customizeVisible &&
            <Grid container xs={12} spacing={2}>
                <GridRow label={"Hard-code parameters"} valueFirst={true}>
                    <Button variant={hardcodeParameters ? "contained" : "outlined"}
                            onClick={() => setHardcodeParameters(true)}>Yes</Button>
                    <Button variant={!hardcodeParameters ? "contained" : "outlined"}
                            onClick={() => setHardcodeParameters(false)}>No</Button>
                </GridRow>
                <GridRow label={"Specify callback"} valueFirst={true}>
                    <Select value={callbackFunction} onChange={(e) => setCallbackFunction(e.target.value)}>
                        <MenuItem value={"storeFull"}>Store response</MenuItem>
                        <MenuItem value={"doNothing"}>Do nothing</MenuItem>
                        <MenuItem value={"custom"}>Custom</MenuItem>
                    </Select>
                </GridRow>
                <GridRow label={"Return requestId"} valueFirst={true}>
                    <Button variant={returnRequestId ? "contained" : "outlined"}
                            onClick={() => setReturnRequestId(true)}>Yes</Button>
                    <Button variant={!returnRequestId ? "contained" : "outlined"}
                            onClick={() => setReturnRequestId(false)}>No</Button>
                </GridRow>
                <GridRow label={"Use FunctionsManager interface"} valueFirst={true}>
                    <Button variant={useInterface ? "contained" : "outlined"}
                            onClick={() => setUseInterface(true)}>Yes</Button>
                    <Button variant={!useInterface ? "contained" : "outlined"}
                            onClick={() => setUseInterface(false)}>No</Button>
                </GridRow>
            </Grid>}

        <MetricsCards functionId={func.functionId}/>

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
    const {chainId, provider, account} = useContext(FunctionsManagerContext)
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
                    </GridRow>
                    <GridRow label={"Return type"}>
                        <Typography variant={"body1"}>
                            {func.metadata_expectedReturnType || "?"} - {returnTypeEnumToString(func.metadata_expectedReturnType)}
                        </Typography>
                    </GridRow>
                </Grid>
            </Paper>
            <ExecutionTable functionId={func.functionId}/>
        </Stack>
    </Box>
}

export default Buy;


