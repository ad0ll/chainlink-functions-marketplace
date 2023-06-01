// Drilldown page for an individual function
import React, {useEffect} from "react";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Grid,
    List,
    ListItem,
    MenuItem,
    Paper,
    Select,
    Stack,
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
    MUMBAI_CHAIN_ID,
    networkConfig,
    returnTypeEnumToString,
    SEPOLIA_CHAIN_ID,
    TypographyWithLinkIcon
} from "./common";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {decodeBytes32String, ethers, formatEther} from "ethers";
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {toast} from "react-toastify";
import {useWeb3React} from "@web3-react/core";
import PublishIcon from '@mui/icons-material/Publish';
import {TryItNowModal} from "./TryItNowModal";
import {FunctionsManager} from "./generated/contract-types";
import {useContract} from "./contractHooks";
import FunctionsManagerJson from "./generated/abi/FunctionsManager.json";
import LinkTokenIcon from "./assets/icons/link-token-blue.svg";


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

const MetricsCards: React.FC<{ functionId: string }> = ({functionId}) => {
    const {chainId} = useWeb3React()

    if (chainId !== MUMBAI_CHAIN_ID && chainId !== SEPOLIA_CHAIN_ID) {
        return <></>
    }

    const [meta, setMeta] = React.useState<Partial<FunctionsManager.FunctionExecuteMetadataStruct>>()
    const functionsManager = useContract(networkConfig[chainId].functionsManager, FunctionsManagerJson.abi) as unknown as FunctionsManager
    useEffect(() => {
        const fetchData = async () => {
            const meta = await functionsManager.getFunctionExecuteMetadata(functionId)
            setMeta({
                functionsCalledCount: meta.functionsCalledCount,
                totalFeesCollected: meta.totalFeesCollected,
                successfulResponseCount: meta.successfulResponseCount,
                failedResponseCount: meta.failedResponseCount,
            })
        }

        // Fetch data immediately
        fetchData();

        // Set up the interval to fetch data every 3 seconds
        const interval = setInterval(fetchData, 3000);

        // Clean up the interval when the component unmounts or when the dependency array changes
        return () => {
            clearInterval(interval);
        };
    }, []); // Empty dependency array to run the effect only once
    const {totalFeesCollected, functionsCalledCount, successfulResponseCount, failedResponseCount} = meta || {}
    if (totalFeesCollected === undefined || functionsCalledCount === undefined || successfulResponseCount === undefined || failedResponseCount === undefined) {
        return <>Missing Metadata</>
    }
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
                    {/*<Typography variant={"h3"} sx={{textAlign: "center"}}>{value}</Typography> : value}*/}
                    {/*<Typography variant={"h5"} sx={{textAlign: "center"}}>{label}</Typography>*/}
                    <Box display={"flex"}>
                        <Box sx={{backgroundColor: "#31ff87"}}
                             width={`${(BigInt(successfulResponseCount) / BigInt(functionsCalledCount)) * 100n}%`}
                             height={25}></Box>
                        <Box sx={{backgroundColor: "#ff3131"}}
                             width={`${(BigInt(failedResponseCount) / BigInt(functionsCalledCount)) * 100n}%`}
                             height={25}></Box>
                    </Box>
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
                      verticalAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column"
                  }}
            >
                <Typography variant={"h4"}>
                    Lifetime Earnings
                </Typography>
                <Typography variant={"h3"}

                            textAlign={"center"}
                >
                    <LinkTokenIcon height={36}
                                   width={36}
                                   style={{marginRight: 8}}/>
                    {ethers.formatUnits(BigInt(totalFeesCollected) - (BigInt(totalFeesCollected) % (10n ** 16n)), "ether")}
                </Typography>
            </Card>
        </Grid>
    </Grid>)
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
                <GridRow label={"Return requestId"}>
                    <Button variant={returnRequestId ? "contained" : "outlined"}
                            onClick={() => setReturnRequestId(true)}>Yes</Button>
                    <Button variant={!returnRequestId ? "contained" : "outlined"}
                            onClick={() => setReturnRequestId(false)}>No</Button>
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


