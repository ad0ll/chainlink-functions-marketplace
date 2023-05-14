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
import {getRandomInt} from "./utils/generators";
import {Link} from "react-router-dom";
import {ResponsiveLine} from '@nivo/line'
import styled from "@emotion/styled";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip as RechartTooltip, XAxis, YAxis} from "recharts";
import {TypographyWithLinkIcon} from "./common";
import {gql, useQuery} from "@apollo/client";
import {Query} from "./gql/graphql";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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
            metadata_fee
            metadata_subId
            metadata_name
            metadata_imageUrl
            metadata_subscriptionPool
            metadata_lockedProfitPool
            metadata_unlockedProfitPool
        }
    }`

export const OwnerDashboard: React.FC = () => {

    
    // const OWNER =
    const [showDetails, setShowDetails] = React.useState(false)

    const {loading, error, data} = useQuery<Query>(OWNER_DASHBOARD_QUERY)
    if (loading) {
        return <Typography><CircularProgress/>Loading...</Typography>
    }
    if (error) {
        console.log(error)
        return <Typography>Something went wrong</Typography>
    }

    //TODO Should make sure that the signed in account is the owner of the contracts
    return <Stack spacing={2}>
        <Typography variant={"h3"} style={{textAlign: "center"}}>Owner Dashboard</Typography>
        <Grid container xs={12} spacing={2}>
            <Grid item xs={12} sm={6}>
                <Card style={{display: "flex", flexDirection: "column", alignItems: "center"}} elevation={4}>
                    <Typography variant={"h4"}>Total calls</Typography>
                    <Typography>
                        {/*<RechartsLineChart data={callData} dataKey={"calls"} xKey={"date"} yKey={"calls"}*/}
                        {/*                   stroke={"#8884d8"} fill={"#8884d8"}/>*/}
                    </Typography>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card style={{display: "flex", flexDirection: "column", alignItems: "center"}} elevation={4}>
                    <Typography variant={"h4"}>Earnings</Typography>
                    <Typography>
                        {/*<RechartsLineChart data={feesCollectedData} dataKey={"fees collected"} xKey={"date"}*/}
                        {/*                   yKey={"fees collected"}*/}
                        {/*                   stroke={"#31ff87"} fill={"#31ff87"}/>*/}
                    </Typography>
                </Card>
            </Grid>
        </Grid>

        <Typography variant={"h4"}>My Functions</Typography>
        <Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Calls 24h</TableCell>
                            <TableCell>Calls 7d</TableCell>
                            {/*<TableCell>Fees</TableCell>*/}
                            {/*<TableCell>Expense</TableCell>*/}
                            <TableCell>Reserved<Tooltip
                                title={"These funds cover the base fee that must be paid by your subscription when making a call to Chainlink Functions. They will be transferred over to your subscription automatically when it runs low. You can't withdraw these funds manually without deleting your listing."}><HelpOutlineIcon/></Tooltip>
                            </TableCell>
                            <TableCell>Locked<Tooltip
                                title={"This number represents the total number of fees contained in in-flight requests. Funds here will be unlocked when "}><HelpOutlineIcon/></Tooltip>
                            </TableCell>

                            <TableCell>Available</TableCell>
                            <TableCell>Withdraw</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.functionRegistereds.map((func, i) => {
                            const callsDaily = getRandomInt(2, 500);
                            const callsWeekly = callsDaily - 7;
                            return (<TableRow key={i}>
                                <TableCell><Link
                                    to={`/buy/${func.functionId}`}><Typography>{func.metadata_name}</Typography></Link></TableCell>
                                <TableCell><Typography>{callsDaily}</Typography></TableCell>
                                <TableCell><Typography>{callsWeekly}</Typography></TableCell>
                                {/*<TableCell><TypographyWithLinkIcon>{(callsWeekly * func.fee).toFixed(2)}</TypographyWithLinkIcon></TableCell>*/}
                                {/*<TableCell><TypographyWithLinkIcon width={25}>{(callsWeekly * func.fee * 0.05).toFixed(2)}</TypographyWithLinkIcon></TableCell>*/}
                                <TableCell><TypographyWithLinkIcon>{(func.metadata_unlockedProfitPool).toFixed(2)}</TypographyWithLinkIcon></TableCell>
                                <TableCell>
                                    <Button color={"primary"}>Withdraw</Button>
                                </TableCell>
                            </TableRow>)
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        <Box sx={{display: "flex", flexDirection: "row-reverse"}}>
            {showDetails
                ? <Button style={{maxWidth: 200}} variant={"contained"} onClick={() => setShowDetails(!showDetails)}>Hide
                    additional details</Button>
                : <Button style={{maxWidth: 200}} variant={"outlined"} onClick={() => setShowDetails(!showDetails)}>Show
                    additional details</Button>
            }
            <Button style={{maxWidth: 200}} variant={"contained"}>Withdraw All</Button>
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