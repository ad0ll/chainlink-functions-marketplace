// Drilldown page for an individual function
import React from "react";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableContainer,
    Typography
} from "@mui/material";
import {fallbackToJazzicon, jazziconImageString, renderCurrency} from "./utils/util";
import {Link, useParams} from "react-router-dom";
import {BashSyntaxHighlighter, SoliditySyntaxHighlighter} from "./Snippets";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {gql, useQuery} from "@apollo/client";
import {FunctionRegistered, Query} from "./gql/graphql";


const DRILLDOWN_QUERY = gql`
    query DrilldownPage($functionId: ID!){
        functionRegistered(
            id: $functionId
        ){
            id
            functionId
            owner
            metadata_fee
            metadata_owner
            metadata_subId
            metadata_name
            metadata_desc
            metadata_imageUrl
            metadata_subscriptionPool
            metadata_lockedProfitPool
            metadata_unlockedProfitPool
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
        <Typography variant={"h6"}>{value}</Typography>
    </GridRow>
}


// export const Buy: React.FC<{func: C
const InputSnippetGenerator: React.FC<{ func: FunctionRegistered }> = ({func}) => {


    const [useCall, setUseCall] = React.useState(true);
    const [hardcodeParameters, setHardcodeParameters] = React.useState(true);
    const [callbackFunction, setCallbackFunction] = React.useState("storeFull");
    const [returnRequestId, setReturnRequestId] = React.useState(true);

    const snippetString = ``
    //     generateSnippetString(func, {
    //     useCall,
    //     hardcodeParameters,
    //     callbackFunction,
    //     returnRequestId
    // })
    return (<Stack spacing={2} sx={{border: 2, borderColor: "secondary.main", borderRadius: 1, padding: 2}}>
        <Grid container xs={12} spacing={2}>
            <GridRow label={"Use call or import interface"}>
                <Button variant={useCall ? "contained" : "outlined"} onClick={() => setUseCall(true)}>Call</Button>
                <Button variant={!useCall ? "contained" : "outlined"}
                        onClick={() => setUseCall(false)}>Interface</Button>
            </GridRow>
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
        </Grid>
        {/*https://mui.com/system/borders/*/}
        {!useCall && <Stack spacing={2}>
            <Typography variant={"h6"}>
                Use the following commands to use the FunctionManage contracts:
            </Typography>
            <Paper sx={{width: "100%"}}>
                <BashSyntaxHighlighter>
                    {/*TODO actually implement hardhat string here*/}
                    {/*TODO we need this to be the actual repo url*/}
                    {`# TODO get some hardhat here
forge install github.com/something/functionManager`}
                </BashSyntaxHighlighter>
            </Paper>
            <Typography variant={"h6"}>
                Then, use the following command to import the interface:
            </Typography>
            <Paper sx={{width: "100%"}}>
                <SoliditySyntaxHighlighter>
                    import "TODO-FIX-ME/FunctionManagerInterface.sol";
                </SoliditySyntaxHighlighter>
            </Paper>
        </Stack>}
        <Typography variant={"h6"}>
            Place the following in your contract
        </Typography>


        <Paper sx={{width: "100%"}}>
            <Box width={"100%"} sx={{
                display: "flex",
                borderColor: "primary.main", border: 1, padding: 1
            }}>
                <Typography>sendRequest Snippet</Typography>
                <CopyToClipboard text={snippetString}>
                    <Button variant={"contained"} color={"secondary"} size={"small"}>Copy</Button>
                </CopyToClipboard>
            </Box>

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

// hainlinkFunction}> = ({func}) => {
export const Buy: React.FC = () => {

    const {functionId} = useParams<{ functionId: string }>();
    const {loading, error, data} = useQuery<Query>(DRILLDOWN_QUERY, {
        variables: {
            functionId
        }
    });


    if (loading) return <Typography><CircularProgress/>Loading...</Typography>
    if (error) return <Typography>Error :( {error.message}</Typography>
    if (!data?.functionRegistered) return <Typography>Function not found</Typography>
    const func = data.functionRegistered;

    return <Box width={{xs: "100%", sm: "100%", md: "80%", lg: "65%"}} margin={"auto"}>
        <Stack spacing={2}>
            <img style={{maxWidth: 150, margin: "auto"}}
                 src={func.metadata_imageUrl || jazziconImageString(func.id)}
                 onError={(e) => fallbackToJazzicon(e, func.id)}/>
            <Typography variant={"h4"} color={"secondary"}
                        sx={{textAlign: "center", paddingLeft: 1, paddingRight: 1}}>{func.metadata_name}</Typography>
            <Typography variant={"h6"} color={"greyscale40.main"}
                        sx={{textAlign: "center", paddingLeft: 1, paddingRight: 1}}>By: <Link
                to={`/author/${func.owner}`}>CoinGecko</Link></Typography>
            <Typography variant={"body1"} sx={{paddingLeft: 1, paddingRight: 1}} color={"text.secondary"}>
                {func.metadata_desc}
            </Typography>

            <Grid xs={12} container>
                <Grid item xs={12}>
                    <Typography variant={"h6"}>Snippet</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button>Customize snippet</Button>
                </Grid>
                <Grid item xs={12}>
                    <InputSnippetGenerator func={func}/>
                </Grid>
            </Grid>
            <Typography variant={"h6"}>Use this function</Typography>
            <Paper sx={{width: "100%", padding: 1}} elevation={4}>
                <Grid container xs={12}>
                    {/*<GridRowTyp label={"Function Type"} value={func.functionType}/>*/}
                    <GridRowTyp label={"Fee"} value={renderCurrency(func.metadata_fee)}/>
                    <GridRow label={"ID"}>
                        {/*TODO remove network hardcoding below */}
                        {/*<Link to={networkConfig.mumbai.getScannerUrl(func.address)}>*/}
                        <Typography variant={"body1"}>{func.id}</Typography>
                        {/*</Link>*/}
                    </GridRow>
                    <GridRowTwoLines label={"Arguments"}>
                        {/*TODO Table looks really ugly*/}
                        <TableContainer>
                            <Table
                                sx={{width: "auto"}}>
                                {/*{func.expectedArgs?.map((arg, i) => {*/}
                                {/*    return <TableRow>*/}
                                {/*        <TableCell>*/}
                                {/*            <Typography variant={"body1"}*/}
                                {/*                        sx={{fontWeight: "bold"}}>{arg.name}</Typography>*/}
                                {/*        </TableCell>*/}
                                {/*        <TableCell>*/}
                                {/*            <Typography variant={"body1"}>{arg.type}</Typography>*/}
                                {/*        </TableCell>*/}
                                {/*    </TableRow>*/}
                                {/*})}*/}
                            </Table>
                        </TableContainer>
                    </GridRowTwoLines>
                </Grid>
            </Paper>
            <Typography variant={"h6"}>Arguments</Typography>

        </Stack>
    </Box>
}

export default Buy;


