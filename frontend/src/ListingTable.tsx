import React from "react";
import {Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import LinkTokenIcon from "./icons/link-token-blue.svg";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {ChainlinkFunction} from "./common";
import {addressToJazziconSeed, truncateIfAddress} from "./util";
import Jazzicon from "./Jazzicon";


const ListingTable: React.FC<{ functions: ChainlinkFunction[] }> = ({functions}) => {
    const notify = () => toast.success("Copied snippet to keyboard");
    return (<Table>
        <TableHead>
            <TableRow>
                <TableCell>Function</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Est. Gas</TableCell>
                <TableCell>Fee</TableCell>
                <TableCell>{/* Copy snippet button */}</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {functions.map((f) => <TableRow>
                <TableCell>
                    <Link to={`/buy/${f.address}`}>
                        <Typography>
                            {f.name}
                        </Typography>
                    </Link>
                </TableCell>
                <TableCell>
                    <Link to={`/author/${f.owner}`} style={{display: "flex",}}>
                        <Jazzicon seed={addressToJazziconSeed(f.owner)}
                                  style={{position: 'relative', height: 20, marginRight: 8}}/>
                        <Typography>
                            {truncateIfAddress(f.owner)}
                        </Typography>
                    </Link>
                </TableCell>
                <TableCell>
                    <Typography>{f.functionType}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>
                        <LocalGasStationIcon style={{position: 'relative', top: '6px'}}/>
                        {f.estimatedGas} {f.estimatedGasToken}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography>
                        <LinkTokenIcon
                            style={{position: 'relative', top: '6px', height: 20, maxWidth: 20}}/>
                        {f.fee.toFixed(3)} LINK
                    </Typography>
                </TableCell>
                <TableCell onClick={notify}>
                    <ContentCopyIcon/>
                </TableCell>
            </TableRow>)}
        </TableBody>
    </Table>)
}

export default ListingTable;
