import React from "react";
import {
    Box,
    Card,
    CardActionArea,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import LinkTokenIcon from "./icons/link-token-blue.svg";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {ChainlinkFunction} from "./common";
import {addressToJazziconSeed, truncateIfAddress} from "./util";
import Jazzicon from "./Jazzicon";


const ListingTable: React.FC<{ functions: ChainlinkFunction[] }> = ({functions}) => {
    const notify = () => toast.success("Copied snippet to keyboard");
    return (<TableContainer>
        <Table>
            {/*<colgroup>*/}
            {/*    <col  />*/}
            {/*    <col style={{width:'10%'}}/>*/}
            {/*    <col style={{width:'10%'}}/>*/}
            {/*    <col style={{width:'10%'}}/>*/}
            {/*    <col style={{width:'5%'}}/>*/}
            {/*</colgroup>*/}
            <TableHead>
                <TableRow>
                    <TableCell width={"50%"}>Function</TableCell>
                    <TableCell width={"10%"}>Author</TableCell>
                    <TableCell width={"10%"}>Type</TableCell>
                    {/*<TableCell>Est. Gas</TableCell>*/}
                    <TableCell width={"10%"}>Fee</TableCell>
                    <TableCell width={"5%"}>{/* Copy snippet button */}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {functions.map((f) => <TableRow>
                    <TableCell>
                        {/*TODO Fix overflow*/}
                        <Link to={`/buy/${f.address}`} >
                            <Typography>
                                {f.name}
                            </Typography>
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Card elevation={1}>
                            <CardActionArea
                                component={Link}
                                to={`/author/${f.owner}`}
                                style={{display: "flex", alignItems: "center", textDecoration: "none", padding: 8}}>
                                <Jazzicon seed={addressToJazziconSeed(f.owner)}
                                          style={{height: 20, marginRight: 8}}/>
                                <Typography>
                                    {truncateIfAddress(f.owner)}
                                </Typography>
                            </CardActionArea>
                        </Card>
                    </TableCell>
                    <TableCell>
                        <Typography>{f.functionType}</Typography>
                    </TableCell>
                    {/*<TableCell>*/}
                    {/*    <Typography>*/}
                    {/*        <LocalGasStationIcon style={{position: 'relative', top: '6px'}}/>*/}
                    {/*        {f.estimatedGas} {f.estimatedGasToken}*/}
                    {/*    </Typography>*/}
                    {/*</TableCell>*/}
                    <TableCell>
                        <Box sx={{display: 'flex'}}>
                            <LinkTokenIcon
                                style={{width: 24}}/>
                            <Typography
                                style={{marginLeft: 6}}
                            >
                                {f.fee.toFixed(3)}
                            </Typography>
                            <Typography
                                style={{marginLeft: 4}}
                            >
                                LINK
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell onClick={notify}>
                        <ContentCopyIcon/>
                    </TableCell>
                </TableRow>)}
            </TableBody>
        </Table>
    </TableContainer>)
}

export default ListingTable;
