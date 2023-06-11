import {Box, CircularProgress, Grid, Stack, Typography} from "@mui/material";
import {GlobalMetricsCard, RecentlyAddedCard} from "./Cards";
import React, {useContext, useEffect} from "react";
import Logo from "./assets/icons/logo-with-text-hd.svg";
import ListingTable from "./ListingTable";
import {gql, useQuery} from "@apollo/client";
import {Query} from "./gql/graphql";
import LinkTokenIcon from "./assets/icons/link-token-blue.svg";
import {ethers} from "ethers";
import {FunctionsManagerContext} from "./FunctionsManagerProvider";

const LISTING_QUERY = gql`
    query EventSpammerFunctionRegistered($first: Int!, $skip: Int!, $searchTerm: String!){
        functionRegistereds(
            orderBy: blockNumber
            orderDirection: desc
            skip: $skip
            first: $first
            where: {
                or: [
                    {metadata_name_contains_nocase: $searchTerm},
                    {metadata_desc_contains_nocase: $searchTerm},
                ]
            }
        ) {
            id
            functionId
            subId
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
            subId
            metadata_expectedArgs
            metadata_name
            metadata_desc
            metadata_imageUrl
            metadata_category
        }
    }
`


const GlobalMetrics: React.FC = () => {

    const {functionsManager} = useContext(FunctionsManagerContext)
    const [functionsRegisteredCount, setFunctionsRegisteredCount] = React.useState<BigInt>(0n);
    const [functionsCalledCount, setFunctionsCalledCount] = React.useState<BigInt>(0n);
    const [totalFeesCollected, setTotalFeesCollected] = React.useState<BigInt>(0n);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setFunctionsRegisteredCount(await functionsManager.functionsRegisteredCount())
                setFunctionsCalledCount(await functionsManager.functionsCalledCount())
                setTotalFeesCollected(await functionsManager.totalFeesCollected())
            } catch (e: any) {
                console.log("Error in GlobalMetrics", e);
                return
            }
        };

        // Fetch data immediately
        fetchData();

        // Set up the interval to fetch data every 3 seconds
        const interval = setInterval(fetchData, 500);

        // Clean up the interval when the component unmounts or when the dependency array changes
        return () => {
            clearInterval(interval);
        };
    }, []); // Empty dependency array to run the effect only once


    return <Stack spacing={2}>
        <Typography variant={"h4"}>Global metrics</Typography>
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <GlobalMetricsCard label={"Registered functions"}
                                   value={functionsRegisteredCount.toString()}/>
            </Grid>
            <Grid item xs={4}>
                <GlobalMetricsCard label={"Function calls completed"}
                                   value={functionsCalledCount.toString()}/>
            </Grid>
            <Grid item xs={4}>
                <GlobalMetricsCard label={"Paid to function creators"}
                                   value={<Typography variant={"h3"}
                                                      style={{marginRight: 4}}
                                                      textAlign={"center"}
                                   >
                                       <LinkTokenIcon height={36}
                                                      width={36}
                                                      style={{marginRight: 8}}/>
                                       {ethers.formatUnits(totalFeesCollected.valueOf() - (totalFeesCollected.valueOf() % (10n ** 16n)), "ether")}
                                   </Typography>
                                   }/>
            </Grid>
        </Grid>
    </Stack>
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
    return (<Stack spacing={2}>

        <Typography variant={"h4"}>Recently added</Typography>
        <Grid container spacing={2}>
            {data?.functionRegistereds.map((func, i) => {
                return (<Grid item xs={4} key={i}>
                    <RecentlyAddedCard func={func}/>
                </Grid>)
            })}
        </Grid>
    </Stack>)
}


export const Home: React.FC = () => {

    return (<Stack spacing={2} marginTop={2}>
        <Box
            sx={{width: "100%", display: "flex", alignItems: "center", flexDirection: "column"}}>
            <Logo style={{maxHeight: 150}}/>
        </Box>
        <GlobalMetrics/>
        <RecentlyAddedTop/>
        <Typography variant={"h4"}>Browse</Typography>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <ListingTable query={LISTING_QUERY} args={{}}/>
            </Grid>
        </Grid>
    </Stack>)
}