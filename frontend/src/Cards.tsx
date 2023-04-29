import React from "react";
import {Button, Card, CardActionArea, CardActions, CardMedia, Grid, Paper, Typography} from "@mui/material";
import {ChainlinkFunction} from "./common";
import {fallbackToJazzicon, jazziconImageString} from "./util";
import {Link} from "react-router-dom";


export const RecentlyAddedCard: React.FC<{ func: ChainlinkFunction }> = ({func}) => {
    // const imageElem = <Jazzicon diameter={80} seed={jsNumberForAddress(func.address)}/>
    return <Card elevation={2}>
        <CardActionArea
            sx={{display: "flex", flexDirection: "column", alignItems: "center", padding: 2}}
            component={Link} to={`buy/${func.address}`}
        >
            <CardMedia
                component={"img"}
                sx={{width: 80}}
                image={func.imageUrl || jazziconImageString(func.address)}
                onError={(e) => fallbackToJazzicon(e, func.address)}/>
            <Typography variant={"h5"} color={"secondary"} style={{whiteSpace:"nowrap", overflow: "hidden"}}>
                {func.name}
            </Typography>
            <Typography variant={"body1"} color={"greyscale40.main"}>
                By: <Link to={"/author/:id"}>CoinGecko</Link>
            </Typography>
            {/*<Typography variant={"body1"} color={"text.secondary"}>*/}
            {/*    Fetches the quote for a given price pair from CoinGecko*/}
            {/*</Typography>*/}
            {/*</Link>*/}
        </CardActionArea>
        {/*<CardActions sx={{display: "flex", justifyContent: "flex-end", margin: 0}}>*/}
        {/*    <Button variant={"outlined"}>Copy Snippet</Button>*/}
        {/*</CardActions>*/}
    </Card>
}