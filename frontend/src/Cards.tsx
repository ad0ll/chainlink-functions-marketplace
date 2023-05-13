import React from "react";
import {Box, Card, CardActionArea, CardMedia, Typography} from "@mui/material";
import {fallbackToJazzicon, jazziconImageString, truncateIfAddress} from "./utils/util";
import {Link} from "react-router-dom";
import {FunctionRegistered} from "./gql/graphql";


// Used in the "Recently Added" carousel of the homepage
export const RecentlyAddedCard: React.FC<{ func: FunctionRegistered }> = ({func}) => {
    // const imageElem = <Jazzicon diameter={80} seed={jsNumberForAddress(func.address)}/>
    return <Card elevation={4}>
        <CardActionArea
            sx={{
                display: "flex",
                // flexDirection: "column",
                // alignItems: "center",
                flexWrap: "wrap",
                // textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                borderRadius: 2,
                padding: 2
            }}
            component={Link} to={`buy/${func.id}`}
        >
            <Box width={"100%"}>
                <CardMedia
                    component={"img"}
                    sx={{width: 80, margin: "auto"}}
                    image={func.metadata_imageUrl || jazziconImageString(func.owner)}
                    onError={(e) => fallbackToJazzicon(e, func.owner)}/>
            </Box>
            <Box width={"100%"}>
                <Typography
                    sx={{
                        textAlign: "center",
                        textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                    }}
                    variant={"h5"} color={"secondary"}>
                    {func.metadata_name}
                </Typography>
            </Box>
            <Box width={"100%"}>
                <Typography
                    sx={{textAlign: "center"}}
                    variant={"body1"} color={"greyscale40.main"}>
                    By: <Link to={`/author/${func.owner}`}>{truncateIfAddress(func.owner)}</Link>
                </Typography>
            </Box>
        </CardActionArea>
        {/*<CardActions sx={{display: "flex", justifyContent: "flex-end", margin: 0}}>*/}
        {/*    <Button variant={"outlined"}>Copy Snippet</Button>*/}
        {/*</CardActions>*/}
    </Card>
}