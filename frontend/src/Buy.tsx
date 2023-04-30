// Drilldown page for an individual function
import React from "react";
import {
    Box,
    Grid,
    List,
    ListItem,
    Paper,
    Stack,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from "@mui/material";
import {fallbackToJazzicon, jazziconImageString} from "./utils/util";
import {Link} from "react-router-dom";
import {generateRandomFunction} from "./utils/generators";

const GridRow: React.FC<{ label: string, children: React.ReactNode}> = ({label, children}) => {
    return <Grid item container xs={12}>
        <Grid item xs={4} sm={3}>
            <Typography variant={"h6"}>{label}</Typography>
        </Grid>
        <Grid item xs={8} sm={9}>
            {children}
        </Grid>
    </Grid>
}

const GridRowTwoLines: React.FC<{ label: string, children: React.ReactNode}> = ({label, children}) => {
    return <Grid item container xs={12}>
        <Grid item xs={4} sm={3}>
            <Typography variant={"h6"}>{label}</Typography>
        </Grid>
        <Grid item xs={12} sx={{paddingLeft: 2}}>
            {children}
        </Grid>
    </Grid>
}

const GridRowTyp: React.FC<{ label: string, value?: string | number }> = ({label, value}) => {
    return <GridRow label={label}>
        <Typography variant={"h6"}>{value}</Typography>
    </GridRow>
}



// export const Buy: React.FC<{func: C
// hainlinkFunction}> = ({func}) => {
export const Buy: React.FC = () => {
    const func = generateRandomFunction();

    return <Box width={{xs: "100%", sm: "100%", md: "80%", lg: "65%"}} margin={"auto"}>
        <Stack spacing={2}>
            <img style={{maxWidth: 150, margin: "auto"}}
                 src={func.imageUrl || jazziconImageString(func.address)}
                 onError={(e) => fallbackToJazzicon(e, func.address)}/>
            <Typography variant={"h4"} color={"secondary"}
                        sx={{textAlign: "center", paddingLeft: 1, paddingRight: 1}}>{func.name}</Typography>
            <Typography variant={"h6"} color={"greyscale40.main"}
                        sx={{textAlign: "center", paddingLeft: 1, paddingRight: 1}}>By: <Link
                to={`/author/${func.owner}`}>CoinGecko</Link></Typography>
            <Typography variant={"body1"} sx={{paddingLeft: 1, paddingRight: 1}} color={"text.secondary"}>
                {func.description}
            </Typography>

            <Typography variant={"h6"}>Use this function</Typography>
            <Paper sx={{width: "100%", padding: 1}} elevation={4}>
                <Grid container xs={12}>
                    <GridRowTyp label={"Function Type"} value={func.functionType}/>
                    <GridRowTyp label={"Fee"} value={func.fee.toString()}/>
                    <GridRowTyp label={"Address"} value={func.address}/>
                    <GridRowTwoLines label={"Arguments"}>
                        {/*TODO Table looks really ugly*/}
                        <TableContainer>
                        <Table
                        sx={{width: "auto"}}
                        >
                            {func.expectedArgs?.map((arg, i) => {
                                return <TableRow>
                                    <TableCell>
                                        <Typography variant={"body1"} sx={{fontWeight: "bold"}}>{arg.name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant={"body1"}>{arg.type}</Typography>
                                    </TableCell>
                                </TableRow>
                            })}
                        </Table>
                        </TableContainer>
                    </GridRowTwoLines>
                </Grid>
            </Paper>
            <Typography variant={"h6"}>Arguments</Typography>

        </Stack>
    </Box>
}

export default Buy;


