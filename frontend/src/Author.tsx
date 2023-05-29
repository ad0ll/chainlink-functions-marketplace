// Code for the user drilldown page
import React from "react";
import {Box, Card, Stack, Tooltip, Typography} from "@mui/material";
import {gql} from "@apollo/client";
import {Link, useParams} from "react-router-dom";
import ListingTable from "./ListingTable";
import {fallbackToJazzicon, jazziconImageString, truncateIfAddress} from "./utils/util";
import {MUMBAI_CHAIN_ID, networkConfig, SEPOLIA_CHAIN_ID} from "./common";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {useWeb3React} from "@web3-react/core";

const OWNER_LISTING_QUERY = gql`
    query AuthorFunctionRegistereds($first: Int!, $skip: Int!, $owner: Bytes!) {
        functionRegistereds(
            orderBy: blockNumber
            orderDirection: desc
            skip: $skip
            first: $first
            where: {owner: $owner}
        ) {
            id
            functionId
            owner
            metadata_name
            metadata_desc
            metadata_imageUrl
            metadata_category
            fee
            blockTimestamp
        }
    }
`;
const AuthorAddressCard: React.FC<{ address?: string }> = ({address}) => {
    const {chainId} = useWeb3React();
    if (chainId !== MUMBAI_CHAIN_ID && chainId !== SEPOLIA_CHAIN_ID) return (<></>)
    //TODO Fetch author metadata from the contract, no need to fetch from the graph
    return <Stack spacing={2} width={"auto"} margin={"auto"} sx={{marginTop: 2}}>
        <img style={{maxWidth: 150, margin: "auto"}}
            // src={func.metadata_imageUrl || jazziconImageString(func.functionId)}
             src={jazziconImageString(address)}
             onError={(e) => fallbackToJazzicon(e, address || "")}/>
        <Card sx={{
            display: "flex",
            alignItems: "center",
            alignContent: "center",
            width: "auto",
            paddingTop: 1,
            paddingBottom: 1,
            paddingLeft: 2,
            paddingRight: 2
        }} elevation={2}>
            <Typography variant={"h5"} color={"secondary"}
                        sx={{
                            marginRight: 1,
                        }}>{truncateIfAddress(address || "")}</Typography>
            <Tooltip title={"Open in scanner"}>
                <Link to={networkConfig[chainId].getScannerAddressUrl(address || "")}>
                    {<OpenInNewIcon/>}
                </Link>
            </Tooltip>
        </Card>
    </Stack>
}
export const Author: React.FC = () => {
    const {address} = useParams<{ address: string }>();

    return (<Stack spacing={2}>
        <AuthorAddressCard address={address}/>
        <Box border={"1px solid white"}>
            <Typography variant={"h4"}>
                Placeholder for author metadata + call history
            </Typography>
        </Box>
        <Typography variant={"h4"}>Functions by {truncateIfAddress(address || "")}</Typography>
        <ListingTable query={OWNER_LISTING_QUERY} args={{owner: address}}
                      columns={["name", "category", "fee", "created", "actions"]}/>
    </Stack>)
}


export default Author;