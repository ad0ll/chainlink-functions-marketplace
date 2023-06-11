/*
The author page is what you see when you click on a user's address in the app
It's light on features so we didn't show it in the demo, currently just lists what functions the Author has registered
We made it with the intent of adding Author metadata to the app, but that feature got cut because time
 */
import React from "react";
import {Card, Stack, Tooltip, Typography} from "@mui/material";
import {gql} from "@apollo/client";
import {Link, useParams} from "react-router-dom";
import {fallbackToJazzicon, jazziconImageString, truncateIfAddress} from "./util";
import {MUMBAI_CHAIN_ID, networkConfig} from "./common";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {useWeb3React} from "@web3-react/core";
import ListingTable from "./ListingTable"

const OWNER_LISTING_QUERY = gql`
    query AuthorFunctionRegistereds($first: Int!, $skip: Int!, $searchTerm: String!, $owner: Bytes!){
        functionRegistereds(
            orderBy: blockNumber
            orderDirection: desc
            skip: $skip
            first: $first
            where: {
                owner: $owner,
                metadata_name_contains_nocase: $searchTerm
            }
        ) {
            id
            functionId
            owner
            fee
            metadata_expectedArgs
            metadata_name
            metadata_desc
            metadata_imageUrl
            metadata_category
            blockTimestamp
        }
    }
`;

const AuthorAddressCard: React.FC<{ address?: string }> = ({address}) => {
    const {chainId} = useWeb3React();
    if (chainId !== MUMBAI_CHAIN_ID) return (<></>)
    //TODO Fetch author metadata from the contract, no need to fetch from the graph
    return <Stack spacing={2} width={"auto"} margin={"auto"} sx={{marginTop: 2}}>
        <img style={{maxWidth: 150, margin: "auto"}}
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
    console.log("Author page...")
    const {address} = useParams<{ address: string }>();
    console.log("author address: ", address)

    return (<Stack spacing={2}>
        <AuthorAddressCard address={address}/>

        <Typography variant={"h4"}>Functions by {address}</Typography>
        <ListingTable query={OWNER_LISTING_QUERY} args={{owner: address}}
                      columns={["name", "category", "fee", "created", "actions"]}/>
    </Stack>)
}


export default Author;