import {Box, CircularProgress, Grid, Stack, Typography} from "@mui/material";
import {RecentlyAddedCard} from "./Cards";
import React from "react";
import Logo from "./assets/icons/logo.svg";
import ListingTable from "./ListingTable";
import {gql, useQuery} from "@apollo/client";
import {Query} from "./gql/graphql";


const LISTING_QUERY = gql`
    query EventSpammerFunctionRegistered($first: Int!, $skip: Int!) {
        functionRegistereds(
            orderBy: blockNumber
            orderDirection: desc
            skip: $skip
            first: $first
        ) {
            id
            functionId
            owner
            metadata_fee
            metadata_name
            metadata_desc
            metadata_imageUrl
            metadata_category
        }
    }
`;

//TODO Later this should be first 10 and the control should be a carousel
const RECENTLY_ADDED_QUERY = gql`
    query EventSpammerRecentFunctionRegistered {
        functionRegistereds(
            orderBy: blockNumber
            orderDirection: desc
            first: 3
        ) {
            id
            functionId
            owner
            metadata_name
            metadata_desc
            metadata_imageUrl
            metadata_category
        }
    }
`

export const SplashTop: React.FC = () => {
    return (<Box
        sx={{width: "100%", display: "flex", alignItems: "center", flexDirection: "column"}}
    >
        <Stack>
            <Logo style={{maxHeight: 80}}/>
            <Typography variant={"h3"}>
                Functions Marketplace
            </Typography>
        </Stack>
    </Box>)
}

export const RecentlyAddedTop: React.FC = () => {
    const {loading, error, data} = useQuery<Query>(RECENTLY_ADDED_QUERY)
    if (loading) {
        return <Typography><CircularProgress/>Loading...</Typography>
    }
    if (error) {
        console.log(error)
        return <Typography>Something went wrong</Typography>
    }
    return (<Grid item container xs={12} spacing={2}>

        <Grid item xs={12}>
            <Typography variant={"h4"}>Recently added</Typography>
        </Grid>
        {data?.functionRegistereds.map((func) => {
            return (<Grid item xs={4}>
                <RecentlyAddedCard func={func}/>
            </Grid>)
        })}
    </Grid>)
}


export const Home: React.FC = () => {

    return (<Grid container spacing={4}>
        <SplashTop/>
        <RecentlyAddedTop/>
        <Grid item container xs={12} spacing={2}>
            <Grid item xs={12}>
                <Typography variant={"h4"}>Browse</Typography>
            </Grid>
            <ListingTable query={LISTING_QUERY}/>
        </Grid>
    </Grid>)
}