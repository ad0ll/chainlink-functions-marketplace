import {Grid, Typography} from "@mui/material";
import {RecentlyAddedCard} from "./Cards";
import React from "react";
import Logo from "./icons/logo.svg";
import ListingTable from "./ListingTable";
import {ChainlinkFunction} from "./common";
import {generateRandomFunction} from "./util";


export const SplashTop: React.FC = () => {
    return (<Grid item container xs={12} spacing={0}>
        <Grid item container justifyContent={"center"} xs={12} spacing={0}>
            <Logo style={{maxHeight: 150, verticalAlign: "middle"}}/>
        </Grid>
        <Grid item container justifyContent={"center"} xs={12}>
            <Typography variant={"h3"}>
                Functions Marketplace
            </Typography>
        </Grid>
    </Grid>)
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
    const functions: ChainlinkFunction[] = []
    for(let i = 0; i < 50; i++) {
        functions.push(generateRandomFunction())
    }

    return (<Grid container spacing={4}>
        {/*<NavBar/>*/}
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