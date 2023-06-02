import {Box, CircularProgress, Grid, Stack, Typography} from "@mui/material";
import {GlobalMetricsCard, RecentlyAddedCard} from "./Cards";
import React, {useEffect} from "react";
import Logo from "./assets/icons/logo.svg";
import ListingTable from "./ListingTable";
import {gql, useQuery} from "@apollo/client";
import {Query} from "./gql/graphql";
import {useContract} from "./contractHooks";
import {MUMBAI_CHAIN_ID, networkConfig, SEPOLIA_CHAIN_ID} from "./common";
import FunctionsManagerJson from "./generated/abi/FunctionsManager.json";
import {FunctionsManager} from "./generated/contract-types";
import {useWeb3React} from "@web3-react/core";
import LinkTokenIcon from "./assets/icons/link-token-blue.svg";
import {ethers} from "ethers";

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
                    #                    {metadata_category_contains: $searchTerm}
                ]
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
            metadata_expectedArgs
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
        <Stack spacing={2}>
            <Logo style={{maxHeight: 80}}/>
            <Typography variant={"h3"}>
                Functions Marketplace
            </Typography>
        </Stack>
    </Box>)
}

const GlobalMetrics: React.FC = () => {
    const {account, chainId, provider} = useWeb3React();

    if (!chainId) {
        return <Typography>Could not get chain id from the connected wallet</Typography>
    } else if (chainId !== MUMBAI_CHAIN_ID && chainId !== SEPOLIA_CHAIN_ID) {
        return <Typography>Wrong chain id. Please connect to Mumbai or Sepolia</Typography>
    }


    const functionsManagerContract = useContract(networkConfig[chainId].functionsManager, FunctionsManagerJson.abi) as unknown as FunctionsManager;
    const [functionsRegisteredCount, setFunctionsRegisteredCount] = React.useState<BigInt>(0n);
    const [functionsCalledCount, setFunctionsCalledCount] = React.useState<BigInt>(0n);
    const [totalFeesCollected, setTotalFeesCollected] = React.useState<BigInt>(0n);
    useEffect(() => {
        const fetchData = async () => {
            setFunctionsRegisteredCount(await functionsManagerContract.functionsRegisteredCount())
            setFunctionsCalledCount(await functionsManagerContract.functionsCalledCount())
            setTotalFeesCollected(await functionsManagerContract.totalFeesCollected())
        };

        // Fetch data immediately
        fetchData();

        // Set up the interval to fetch data every 3 seconds
        const interval = setInterval(fetchData, 3000);

        // Clean up the interval when the component unmounts or when the dependency array changes
        return () => {
            clearInterval(interval);
        };
    }, []); // Empty dependency array to run the effect only once


    return <Grid item container xs={12} spacing={2}>
        <Grid item xs={12}>
            <Typography variant={"h4"}>Global metrics</Typography>
        </Grid>
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

    return (<Stack spacing={4} marginTop={2}>
        <SplashTop/>
        <GlobalMetrics/>
        <RecentlyAddedTop/>
        <Typography variant={"h4"}>Browse</Typography>
        <ListingTable query={LISTING_QUERY} args={{}}/>
    </Stack>)
}