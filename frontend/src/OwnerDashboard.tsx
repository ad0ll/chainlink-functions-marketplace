import React from "react";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import {ResponsiveLine} from '@nivo/line'
import styled from "@emotion/styled";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip as RechartTooltip, XAxis, YAxis} from "recharts";
import {nDaysAgoUTCInSeconds, TypographyWithLinkIcon} from "./common";
import {gql, useQuery} from "@apollo/client";
import {FunctionRegistered, Query} from "./gql/graphql";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {BigNumberish, ethers, formatEther} from "ethers";
import ArticleIcon from '@mui/icons-material/Article';

const OWNER_DASHBOARD_QUERY = gql`
    query EventSpammerOwnerPage($owner: Bytes!){
        functionRegistereds(
            orderBy: metadata_unlockedProfitPool
            orderDirection: desc
            where: {
                owner: $owner
            }
        ){
            id
            functionId
            owner
            blockTimestamp
            metadata_fee
            metadata_subId
            metadata_name
            metadata_imageUrl
            metadata_subscriptionPool
            metadata_lockedProfitPool
            metadata_unlockedProfitPool
        }
    }`


//TODO below should be functionCallCompleteds, but we aren't producing those yet
const OWNER_DASHBOARD_STATS_QUERY = gql`
    query EventSpammerOwnerPageStats($functionId: Bytes!, $blockTimestamp_gt: BigInt!){
        functionCalleds(where: {
            functionId: $functionId,
            blockTimestamp_gt: $blockTimestamp_gt
        },
            first: 10000){
            blockTimestamp
        }
    }`

//TODO below should be functionCallCompleteds, but we aren't producing those yet
const OWNER_DASHBOARD_STATS_TOP_QUERY = gql`
    query EventSpammerOwnerPageStats($owner: Bytes!, $blockTimestamp_gt: BigInt!){
        functionCalleds(where: {
            owner: $owner,
            blockTimestamp_gt: $blockTimestamp_gt
        },
            first: 10000){
            fee
            blockTimestamp
        }
    }`


// Separate component because we have per-function queries for stats
// Because unwinding relationships would take too long
// And I didn't want to do it.
const StatsCell: React.FC<{ func: FunctionRegistered, blockTimestamp: BigNumberish }> = ({func, blockTimestamp}) => {
    const {loading, error, data} = useQuery<Query>(OWNER_DASHBOARD_STATS_QUERY, {
        variables: {
            functionId: func.functionId,
            blockTimestamp_gt: blockTimestamp
        }
    })
    if (loading) {
        return <Typography><CircularProgress/>Loading...</Typography>
    }
    if (error) {
        return <Typography>Something went wrong</Typography>
    }

    //TODO Below should be functionCallCompleteds, but we aren't producing those yet
    return (<TableCell><Typography>{data?.functionCalleds.length ?? 0}</Typography></TableCell>)
}
const StatCards: React.FC<{ owner: string, blockTimestamp: BigNumberish }> = ({
                                                                                  owner,
                                                                                  blockTimestamp
                                                                              }) => {
    const {loading, error, data} = useQuery<Query>(OWNER_DASHBOARD_STATS_TOP_QUERY, {
        variables: {
            owner: owner,
            blockTimestamp_gt: blockTimestamp,
        }
    });

    if (loading) {
        return <Typography><CircularProgress/>Loading...</Typography>
    }

    if (error) {
        return <Typography>Something went wrong</Typography>
    }

    // TODO could do this in the subgraph mapping instead of here
    // TODO below organization of data is miserable
    const callDataRaw: { [key: string]: number } = {}
    const feeDataRaw: { [key: string]: bigint } = {}

    data?.functionCalleds.forEach((f) => {
        const date = new Date(f.blockTimestamp * 1000); // Convert timestamp to milliseconds
        // Clear the time portion of the date to represent the start of the day
        date.setHours(0, 0, 0, 0);
        const dayKey = date.toLocaleDateString(); // Get the dayKey in 'MM/DD/YYYY' format
        callDataRaw[dayKey] = (callDataRaw[dayKey] || 0) + 1; // Tick the day count or init

        feeDataRaw[dayKey] = feeDataRaw[dayKey] ? feeDataRaw[dayKey] + ethers.toBigInt(f.fee) : ethers.toBigInt(f.fee);
    })


    const callData = Object.entries(callDataRaw).map(([date, calls]) => {
        return {
            date,
            calls
        }
    })
    const feeData: { date: string, fees: string }[] = Object.entries(feeDataRaw).map(([date, fees]) => {
        return {
            date,
            fees: formatEther(fees)
        }
    })

    return <Grid container xs={12} spacing={2}>
        <Grid item xs={12} sm={6}>
            <Card style={{display: "flex", flexDirection: "column", alignItems: "center"}} elevation={4}>
                <Typography variant={"h4"}>Total calls</Typography>
                <Typography>
                    <RechartsLineChart data={callData} dataKey={"calls"} xKey={"date"} yKey={"calls"}
                                       stroke={"#8884d8"} fill={"#8884d8"}/>
                </Typography>
            </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
            <Card style={{display: "flex", flexDirection: "column", alignItems: "center"}} elevation={4}>
                <Typography variant={"h4"}>Earnings</Typography>
                <Typography>
                    <RechartsLineChart data={feeData} dataKey={"fees"} xKey={"date"}
                                       yKey={"fees"}
                                       stroke={"#31ff87"} fill={"#31ff87"}/>
                </Typography>
            </Card>
        </Grid>
    </Grid>
}


export const OwnerDashboard: React.FC = () => {

    // TODO Once metamask is in remove this hardcoding
    const OWNER = "0x9B73FC82Ea166ceAd839ff6EF476ac2e696dBA63"

    const [showDetails, setShowDetails] = React.useState(false)

    const {loading, error, data} = useQuery<Query>(OWNER_DASHBOARD_QUERY, {
        variables: {
            owner: OWNER
        }
    })
    if (loading) {
        return <Typography><CircularProgress/>Loading...</Typography>
    }
    if (error) {
        console.log(error)
        return <Typography>Something went wrong</Typography>
    }

    console.log(nDaysAgoUTCInSeconds(1))
    const blockTimestamp = nDaysAgoUTCInSeconds(7)
    return <Stack spacing={2}>
        <Typography variant={"h3"} style={{textAlign: "center"}}>Owner Dashboard</Typography>
        <StatCards owner={OWNER} blockTimestamp={blockTimestamp}/>

        <TableContainer sx={{border: "1px solid white", padding: 2}}>
            <Box sx={{border: "1px solid primary.main", display: "flex"}}>
                <Typography variant={"h4"}>My Functions</Typography>
                {<Button startIcon={<ArticleIcon/>} style={{maxWidth: 300, marginLeft: "auto"}}
                         variant={showDetails ? "contained" : "outlined"} onClick={() => setShowDetails(!showDetails)}
                         color={"secondary"}>
                    {showDetails ? "Hide" : "Show"} details
                </Button>}
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><Typography>Name</Typography></TableCell>
                        <TableCell><Typography>Calls 24h</Typography></TableCell>
                        <TableCell><Typography>Calls 7d</Typography></TableCell>
                        {/*Hide if showDetail is false*/}
                        {showDetails && <TableCell>
                            <Tooltip
                                title={"These funds cover the base fee that must be paid by your subscription when making a call to Chainlink Functions. They will be transferred over to your subscription automatically when it runs low. You can't withdraw these funds manually without deleting your listing."}>
                                <Typography>Reserved<HelpOutlineIcon/></Typography>
                            </Tooltip>
                        </TableCell>}
                        {showDetails && <TableCell sx={{display: showDetails ? "" : "hidden"}}>
                            <Tooltip
                                title={"This number represents the total number of fees contained in in-flight requests. Funds here will be unlocked when "}>
                                <Typography>Locked <HelpOutlineIcon/></Typography>
                            </Tooltip>
                        </TableCell>}
                        <TableCell><Typography>Available</Typography></TableCell>
                        <TableCell><Typography>Withdraw</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.functionRegistereds.map((func, i) => {
                        return (<TableRow key={i}>
                            <TableCell><Link
                                to={`/buy/${func.id}`}><Typography>{func.metadata_name}</Typography></Link></TableCell>
                            <StatsCell func={func} blockTimestamp={nDaysAgoUTCInSeconds(1).toString()}></StatsCell>
                            <StatsCell func={func} blockTimestamp={nDaysAgoUTCInSeconds(7).toString()}></StatsCell>
                            {showDetails &&
                                <TableCell><TypographyWithLinkIcon>{formatEther(func.metadata_subscriptionPool)}</TypographyWithLinkIcon></TableCell>}
                            {showDetails &&
                                <TableCell><TypographyWithLinkIcon>{formatEther(func.metadata_lockedProfitPool)}</TypographyWithLinkIcon></TableCell>}
                            <TableCell><TypographyWithLinkIcon>{formatEther(func.metadata_unlockedProfitPool)}</TypographyWithLinkIcon></TableCell>
                            <TableCell>
                                <Button color={"secondary"}>Withdraw</Button>
                            </TableCell>
                        </TableRow>)
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        <Box sx={{display: "flex", flexDirection: "row-reverse", justifyContent: "center"}}>
            <Button sx={{padding: 1, minWidth: 200, maxWidth: 400}} variant={"contained"} color={"secondary"}>Withdraw
                All</Button>
        </Box>
    </Stack>
}


// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const Parent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const Child = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const NivoGridWrapper: React.FC<
    React.PropsWithChildren<{}>
> = ({children}) => {
    return (
        <Parent>
            <Child>{children}</Child>
        </Parent>
    );
};

const RechartsLineChart: React.FC<{
    data: any,
    dataKey: string,
    xKey: string,
    yKey: string,
    stroke?: string,
    fill?: string
}> = ({
          data,
          dataKey,
          xKey,
          yKey,
          stroke = "#a536e1",
          fill = "#a536e1",
      }) => {
    // TODO make the below responsive instead of using fixed numbers
    return <ResponsiveContainer width={450} height={250}>
        <LineChart data={data} margin={{top: 20, right: 20, left: 0, bottom: 20}}>
            <XAxis dataKey={xKey}/>
            <YAxis dataKey={yKey}/>
            <CartesianGrid strokeDasharray="3 3"/>
            <RechartTooltip/>
            <Line type="monotone" dataKey={dataKey} stroke={stroke} fill={fill} strokeWidth={3} activeDot={{r: 10}}/>
        </LineChart>
    </ResponsiveContainer>
}

const NivoLineChart: React.FC<{ data: any }> = ({data /* see data tab */}) => (
    <NivoGridWrapper>
        <ResponsiveLine
            data={data}
            margin={{top: 50, right: 110, bottom: 50, left: 60}}
            xScale={{type: 'point'}}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: true,
                reverse: false
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'transportation',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'count',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            pointSize={10}
            pointColor={{theme: 'background'}}
            pointBorderWidth={2}
            pointBorderColor={{from: 'serieColor'}}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    </NivoGridWrapper>
)