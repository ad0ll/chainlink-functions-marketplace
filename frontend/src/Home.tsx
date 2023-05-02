import {Box, Grid, Stack, Typography} from "@mui/material";
import {RecentlyAddedCard} from "./Cards";
import React from "react";
import Logo from "./assets/icons/logo.svg";
import ListingTable from "./ListingTable";
import {ChainlinkFunction} from "./common";

import {generateFunctions, generateRandomFunction} from "./utils/generators";


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
    return (<Grid item container xs={12} spacing={2}>
        <Grid item xs={12}>
            <Typography variant={"h4"}>Recently added</Typography>
        </Grid>
            <Grid item xs={4}>
                <RecentlyAddedCard func={generateRandomFunction()}/>
            </Grid>
            <Grid item xs={4}>
                <RecentlyAddedCard func={generateRandomFunction()}/>
            </Grid>
            <Grid item xs={4}>
                <RecentlyAddedCard func={generateRandomFunction()}/>
        </Grid>
    </Grid>)
}
export const Home: React.FC = () => {
    const functions = generateFunctions(50)

    return (<Grid container spacing={4}>
        <SplashTop/>
        <RecentlyAddedTop/>
        <Grid item container xs={12} spacing={2}>
            <Grid item xs={12}>
                <Typography variant={"h4"}>Browse</Typography>
            </Grid>
            <ListingTable functions={functions}/>
        </Grid>
    </Grid>)
}