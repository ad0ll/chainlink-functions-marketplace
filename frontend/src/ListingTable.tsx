/*
ListingTable is a generic table used to list Chainlink Functions based integrations. It's used on the home page,
the owner dashboard, and the user drilldown
 */
import React, {startTransition, useContext, useEffect, useState} from "react";
import {
    Box,
    Button,
    CardMedia,
    CircularProgress,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {fallbackToJazzicon, jazziconImageString, renderCurrency} from "./util";
import {generateDefaultSnippetString, SoliditySyntaxHighlighter} from "./ContractGenerator";
import {DocumentNode, useQuery} from "@apollo/client";
import {FunctionRegistered, Query} from "./gql/graphql";
import {
    blockTimestampToDate,
    functionRegisteredToCombinedMetadata,
    SHORT_POLL_INTERVAL,
    TypographyWithLinkIcon
} from "./common";
import {Search as SearchIcon} from "@mui/icons-material";
import {ethers, parseUnits} from "ethers"
import {AddressCard} from "./Cards";
import {TryItNowModal} from "./TryItNowModal";
import {FunctionsBillingRegistryInterface} from "./generated/contract-types";
import {FunctionsManagerContext} from "./FunctionsManagerProvider";


type AvailableListingColumns = "name" | "author" | "category" | "fee" | "created" | "actions";
const ListingTable: React.FC<{
    query: DocumentNode,
    args: Object,
    pollInterval?: number,
    columns?: AvailableListingColumns[]
}> = ({
          query,
          args,
          pollInterval = SHORT_POLL_INTERVAL,
          columns = ["name", "author", "category", "fee", "created", "actions"]
      }) => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(500);
    const [stageNameDescFilter, setStageNameDescFilter] = useState("");
    const [nameDescFilter, setNameDescFilter] = useState("");
    const [functionSelected, setFunctionSelected] = useState<FunctionRegistered>();
    const [tryDialogOpen, setTryDialogOpen] = useState(false);
    const [baseFee, setBaseFee] = useState(0n)
    const {functionsManager, functionsBillingRegistry} = useContext(FunctionsManagerContext);
    useEffect(() => {
        if (!functionSelected || !functionSelected.functionId) return;
        const fetchData = async () => {
            try {
                console.log("functionSelected", functionSelected)
                const requestBilling: FunctionsBillingRegistryInterface.RequestBillingStruct = {
                    subscriptionId: functionSelected?.subId,
                    client: functionSelected?.owner,
                    gasLimit: 300_000,
                    gasPrice: parseUnits("30", "gwei")
                }
                const baseFee = await functionsBillingRegistry.getRequiredFee("0x", requestBilling)
                console.log("baseFee", baseFee, "wei")
                setBaseFee(baseFee)
            } catch (e: any) {
                console.error("Drilldown fetchData", e)
            }
        }
        fetchData();
    }, [functionSelected]);
    const skip = page * pageSize;
    const {loading, error, data} = useQuery<Query, { first: number, skip: number, searchTerm: string }>(query, {
        variables: {
            ...args,
            skip,
            first: pageSize,
            searchTerm: nameDescFilter,
        },
        pollInterval,
    })


    const notify = () => toast.success("Copied snippet to keyboard");

    if (loading) {
        return <Typography><CircularProgress/>Loading...</Typography>
    }
    if (error) {
        console.log(error)
        return <Typography>Something went wrong</Typography>
    }
    if (!data) {
        return <Typography>Something went wrong, data is undefined</Typography>
    }


    return (
        <TableContainer>
            <TryItNowModal
                func={functionRegisteredToCombinedMetadata(functionSelected)}
                open={tryDialogOpen}
                setOpen={setTryDialogOpen}
            />
            <Stack direction={"row"} spacing={1}>
                <TextField onChange={(e) => setStageNameDescFilter(e.target.value)} placeholder={"Search"}
                           onKeyUp={(e) => {
                               if (e.key === 'Enter') {
                                   setNameDescFilter(stageNameDescFilter)
                               }
                           }}
                           sx={{minWidth: 300, maxWidth: 400}}
                           value={stageNameDescFilter} inputProps={{}}/>
                <Button
                    startIcon={<SearchIcon/>}
                    variant={"contained"}
                    onClick={() => {
                        setNameDescFilter(stageNameDescFilter)
                    }}>Search</Button>
            </Stack>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.find(f => f === "name") &&
                            <TableCell width={"55%"}><Typography>Function</Typography></TableCell>}
                        {columns.find(f => f === "author") &&
                            <TableCell width={"10%"}><Typography>Author</Typography></TableCell>}
                        {columns.find(f => f === "category") &&
                            <TableCell width={"10%"}><Typography>Category</Typography></TableCell>}
                        {columns.find(f => f === "fee") &&
                            <TableCell width={"10%"}><Typography>Fee</Typography></TableCell>}
                        {columns.find(f => f === "created") &&
                            <TableCell width={"10%"}><Typography>Added</Typography></TableCell>}
                        {columns.find(f => f === "actions") &&
                            <TableCell width={"5%"}><Typography>Actions</Typography></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.functionRegistereds.map((f, i) => <TableRow key={i}>
                        {columns.find(f => f === "name") && <TableCell>
                            {/*TODO Fix overflow*/}
                            <Link to={`/buy/${f.functionId}`} style={{display: "flex", alignItems: "center"}}>
                                <CardMedia
                                    component={"img"}
                                    sx={{width: 32, marginRight: 1}}
                                    image={f.metadata_imageUrl || jazziconImageString(f.functionId)}
                                    onError={(e) => fallbackToJazzicon(e, f.functionId)}/>
                                <Typography>
                                    {f.metadata_name}
                                </Typography>
                            </Link>
                        </TableCell>}
                        {columns.find(f => f === "author") && <TableCell>
                            <AddressCard addr={f.owner}/>
                        </TableCell>}
                        {columns.find(f => f === "category") &&
                            <TableCell>
                                <Typography>{ethers.decodeBytes32String(f.metadata_category)}</Typography>
                            </TableCell>}
                        {columns.find(f => f === "fee") && <TableCell>
                            <TypographyWithLinkIcon includeSuffix={false}>
                                {renderCurrency(f.fee)}
                            </TypographyWithLinkIcon>
                        </TableCell>}
                        {columns.find(f => f === "created") && <TableCell>
                            <Typography>{blockTimestampToDate(f.blockTimestamp)}</Typography>
                        </TableCell>}
                        {columns.find(f => f === "actions") && <TableCell>
                            <Button variant={"outlined"} sx={{width: "100%"}}
                                    onClick={() => {
                                        startTransition(() => {
                                            setFunctionSelected(f)
                                            setTryDialogOpen(true)
                                        })
                                    }}>Try</Button>
                            <Tooltip placement={"bottom-start"}
                                     title={<Box sx={{minWidth: 450}}>
                                         <Typography variant={"h6"}>Click to copy example contract</Typography>
                                         <SoliditySyntaxHighlighter>
                                             {generateDefaultSnippetString(f, baseFee)}
                                         </SoliditySyntaxHighlighter>
                                     </Box>}>
                                <Button variant={"outlined"}
                                        onMouseEnter={() => setFunctionSelected(f)}
                                        onClick={notify}>Contract</Button>
                            </Tooltip>
                        </TableCell>}
                    </TableRow>)}
                </TableBody>
                {/*We had a really hard time with pagination w/ the graphql api, and cut it so we could focus on features*/}
                {/*<TableFooter>*/}
                {/*    <TableRow>*/}
                {/*        <TablePagination*/}
                {/*            rowsPerPageOptions={[5, 10, 25]}*/}
                {/*            colSpan={3}*/}
                {/*            count={-1}*/}
                {/*            rowsPerPage={pageSize}*/}
                {/*            page={page}*/}
                {/*            SelectProps={{*/}
                {/*                inputProps: {*/}
                {/*                    'aria-label': 'rows per page',*/}
                {/*                },*/}
                {/*                native: true,*/}
                {/*            }}*/}
                {/*            onPageChange={(e, newPage) => setPage(newPage)}*/}
                {/*            onRowsPerPageChange={(e) => setPageSize(parseInt(e.target.value))}*/}
                {/*        />*/}
                {/*    </TableRow>*/}
                {/*</TableFooter>*/}
            </Table>
        </TableContainer>
    )
}

export default ListingTable;
