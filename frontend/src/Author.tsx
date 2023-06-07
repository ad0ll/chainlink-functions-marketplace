// Code for the user drilldown page
import React from "react";
import {Card, Stack, Tooltip, Typography} from "@mui/material";
import {gql} from "@apollo/client";
import {Link, useParams} from "react-router-dom";
import {fallbackToJazzicon, jazziconImageString, truncateIfAddress} from "./utils/util";
import {MUMBAI_CHAIN_ID, networkConfig, SEPOLIA_CHAIN_ID} from "./common";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {useWeb3React} from "@web3-react/core";
import ListingTable from "./ListingTable";

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
    #    query AuthorFunctionRegistereds($first: Int!, $skip: Int!, $owner: Bytes!, $searchTerm: String!) {
    #        functionRegistereds(
    #            orderBy: blockNumber
    #            orderDirection: desc
    #            skip: $skip
    #            first: $first
    #            where: {
    #                owner: $owner,
    #                or: [
    #                    {metadata_name_contains_nocase: $searchTerm},
    #                    {metadata_desc_contains_nocase: $searchTerm},
    #                    #                    {metadata_category_contains: $searchTerm}
    #                ]
    #            }
    #        ) {
    #            id
    #            functionId
    #            owner
    #            metadata_name
    #            metadata_desc
    #            metadata_imageUrl
    #            metadata_category
    #            fee
    #            blockTimestamp
    #        }
    #    }
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
            {/*<Tooltip title={"Click to copy to clipboard"}>*/}
            {/*<CopyToClipboard text={address || ""}>*/}
            <Typography variant={"h5"} color={"secondary"}
                        sx={{
                            marginRight: 1,
                        }}>{truncateIfAddress(address || "")}</Typography>
            {/*</CopyToClipboard>*/}
            {/*</Tooltip>*/}
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