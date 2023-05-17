//ListingTable.tsx, used  for the function listing on the homepage.
import React, {useState} from "react";
import {
    Box,
    Card,
    CardActionArea,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {addressToJazziconSeed, renderCurrency, truncateIfAddress} from "./utils/util";
import Jazzicon from "./Jazzicon";
import {generateDefaultSnippetString, SoliditySyntaxHighlighter} from "./Snippets";
import {DocumentNode, useQuery} from "@apollo/client";
import {Query} from "./gql/graphql";
import {MUMBAI_CHAIN_ID, networkConfig, SEPOLIA_CHAIN_ID, TypographyWithLinkIcon} from "./common";
import {Search as SearchIcon} from "@mui/icons-material";
import {ethers} from "ethers"
import {useWeb3React} from "@web3-react/core";


const ListingTable: React.FC<{ query: DocumentNode }> = ({query}) => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [nameDescFilter, setNameDescFilter] = useState("");
    const [shouldSearchDesc, setShouldSearchDesc] = useState(false);
    const [sortTerm, setSortTerm] = useState<"name" | "description" | "author A-Z" | "author Z-A" | "fee, lowest first" | "fee, highest first">("name");
    const {account, chainId} = useWeb3React()
    const skip = page * pageSize;
    const {loading, error, data} = useQuery<Query, { first: number, skip: number }>(query, {
        variables: {
            skip,
            first: pageSize
        }
    })

    const notify = () => toast.success("Copied snippet to keyboard");

    // TODO loading is ugly
    if (loading) {
        return <Typography><CircularProgress/>Loading...</Typography>
    }
    if (error) {
        return <Typography>Something went wrong</Typography>
    }
    if (!data) {
        return <Typography>Something went wrong, data is undefined</Typography>
    }

    if (chainId !== MUMBAI_CHAIN_ID && chainId !== SEPOLIA_CHAIN_ID) {
        return <Typography>Please switch to either Mumbai or Sepolia in Metamask</Typography>
    }

    return (
        <TableContainer>
            <Box width={"100%"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <TextField onChange={(e) => setNameDescFilter(e.target.value)} placeholder={"Search"} inputProps={{
                    startAdornment: <SearchIcon/>
                }}></TextField>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={"50%"}>Function</TableCell>
                        <TableCell width={"10%"}>Author</TableCell>
                        <TableCell width={"10%"}>Category</TableCell>
                        <TableCell width={"10%"}>Fee</TableCell>
                        <TableCell width={"5%"}>{/* Copy snippet button */}</TableCell>
                        {/*    TODO Add "Added" or whatever column name for when the function was created. See block timestamp "*/}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.functionRegistereds.map((f, i) => <TableRow key={i}>
                        <TableCell>
                            {/*TODO Fix overflow*/}
                            <Link to={`/buy/${f.id}`}>
                                <Typography>
                                    {f.metadata_name}
                                </Typography>
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Card elevation={2}>
                                <CardActionArea
                                    component={Link}
                                    to={`/author/${f.owner}`}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        textDecoration: "none",
                                        padding: 8
                                    }}>
                                    <Jazzicon seed={addressToJazziconSeed(f.owner)}
                                              style={{height: 20, marginRight: 8}}/>
                                    <Typography>
                                        {truncateIfAddress(f.owner)}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </TableCell>
                        <TableCell>
                            <Typography>{ethers.decodeBytes32String(f.metadata_category)}</Typography>
                        </TableCell>
                        <TableCell>
                            <TypographyWithLinkIcon>
                                {renderCurrency(f.metadata_fee)}
                            </TypographyWithLinkIcon>
                        </TableCell>
                        <TableCell>
                            <Tooltip placement={"bottom-start"} title={<Box sx={{minWidth: 450}}>
                                <Typography variant={"h6"}>Click to copy contract snippet</Typography>
                                <SoliditySyntaxHighlighter>
                                    {generateDefaultSnippetString(f, networkConfig[chainId].functionsManager)}
                                </SoliditySyntaxHighlighter>
                            </Box>}>
                                <ContentCopyIcon onClick={notify}/>
                            </Tooltip>
                        </TableCell>
                    </TableRow>)}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            colSpan={3}
                            count={-1}
                            rowsPerPage={pageSize}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                    'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            onRowsPerPageChange={(e) => setPageSize(parseInt(e.target.value))}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default ListingTable;
