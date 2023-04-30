import React from "react";
import {Box, Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import {ChainlinkFunction} from "./common";
import {fallbackToJazzicon, jazziconImageString} from "./utils/util";
import {Link} from "react-router-dom";


// Used in the "Recently Added" carousel of the homepage
export const RecentlyAddedCard: React.FC<{ func: ChainlinkFunction }> = ({func}) => {
    // const imageElem = <Jazzicon diameter={80} seed={jsNumberForAddress(func.address)}/>
    return <Card elevation={2}

    >
        <CardActionArea
            sx={{display: "flex",
                // flexDirection: "column",
                // alignItems: "center",
                flexWrap: "wrap",
                // textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",

                padding: 2}}
            component={Link} to={`buy/${func.address}`}
        >


            <Box width={"100%"}>
            <CardMedia
                component={"img"}
                sx={{ width: 80, margin: "auto"}}
                image={func.imageUrl || jazziconImageString(func.address)}
                onError={(e) => fallbackToJazzicon(e, func.address)}/>
            </Box>
            <Box width={"100%"}>
                <Typography
                    sx={{
                        textAlign: "center",
                        textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}
                    variant={"h5"} color={"secondary"}>
                    {func.name}
                </Typography>
            </Box>
            <Box width={"100%"}>
                <Typography
                    sx={{ textAlign: "center"}}
                    variant={"body1"} color={"greyscale40.main"}>
                    By: <Link to={"/author/:id"}>CoinGecko</Link>
                </Typography>
            </Box>
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