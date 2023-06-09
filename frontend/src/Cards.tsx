import React, {ReactNode} from "react";
import {Box, Card, CardActionArea, CardMedia, Stack, Typography} from "@mui/material";
import {addressToJazziconSeed, fallbackToJazzicon, jazziconImageString, truncateIfAddress} from "./utils/util";
import {Link} from "react-router-dom";
import {FunctionRegistered} from "./gql/graphql";
import Jazzicon from "./Jazzicon";

export const GlobalMetricsCard: React.FC<{ label: string, value: ReactNode | string }> = ({label, value}) => {
    return <Card elevation={4}
                 sx={{
                     borderRadius: 2,
                     padding: 2,
                     height: "100%",
                     verticalAlign: "center"
                 }}
    >
        {typeof value === "string" ? <Typography variant={"h3"} sx={{textAlign: "center"}}>{value}</Typography> : value}
        <Typography variant={"h5"} sx={{textAlign: "center"}}>{label}</Typography>
    </Card>
}

// Used in the "Recently Added" carousel of the homepage
export const RecentlyAddedCard: React.FC<{ func: FunctionRegistered }> = ({func}) => {
    const [mouseOver, setMouseOver] = React.useState(false)
    return <Card elevation={4} sx={{borderRadius: 2, height: "100%"}}
                 onMouseEnter={() => setMouseOver(true)}
                 onMouseLeave={() => setMouseOver(false)}
    >
        <CardActionArea
            sx={{
                display: "flex",
                flexWrap: "wrap",
                overflow: "hidden",
                whiteSpace: "nowrap",
                padding: 2,
                borderRadius: 2,
                height: "100%"
            }}
            component={Link} to={`buy/${func.functionId}`}
        >
            <Stack spacing={1}>
                <Box width={"100%"} height={80} display={"flex"} alignItems={"center"}>
                    <CardMedia
                        component={"img"}
                        sx={{width: 80, margin: "auto"}}
                        image={func.metadata_imageUrl || jazziconImageString(func.functionId)}
                        onError={(e) => fallbackToJazzicon(e, func.functionId)}/>
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
            </Stack>
        </CardActionArea>
        {/*<CardActions sx={{display: mouseOver ? "flex" : "none", justifyContent: "flex-end", margin: 0}}>*/}
        {/*    <Button variant={"outlined"}>Copy Snippet</Button>*/}
        {/*</CardActions>*/}
    </Card>
}

export const AddressCard: React.FC<{ addr: string, truncate?: boolean }> = ({
                                                                                addr,
                                                                                truncate = true,
                                                                            }) => (
    <Card elevation={2}>
        <CardActionArea
            component={Link}
            to={`/author/${addr}`}
            sx={{
                display: "flex",
                textDecoration: "none",
                padding: 1
            }}>
            <Jazzicon seed={addressToJazziconSeed(addr)}
                      style={{height: 20, marginRight: 8}}/>
            <Typography>
                {truncate ?
                    truncateIfAddress(addr)
                    : addr}
            </Typography>
        </CardActionArea>
    </Card>)
