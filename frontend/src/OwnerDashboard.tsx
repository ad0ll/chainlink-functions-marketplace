import React from "react";
import {
    Box,
    Button,
    Card,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {generateFunctions, getRandomInt} from "./utils/generators";
import {Link} from "react-router-dom";
import {ResponsiveLine} from '@nivo/line'
import styled from "@emotion/styled";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip as RechartTooltip, XAxis, YAxis} from "recharts";
import {TypographyWithLinkIcon} from "./common";

export const OwnerDashboard: React.FC = () => {

    const callData = Array.from(Array(7).keys()).map((day) => ({
        date: new Date(Date.now() - (6 - day) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        calls: getRandomInt(0, 100)
    }))
    // const feesCollectedData: { id: string, color: string, data: { x: string, y: number }[] }[] = [{
    //     id: "calls",
    //     color: "hsl(89, 70%, 50%)",
    //     data: []
    // }]
    let profits = 0;
    const feesCollectedData = Array.from(Array(7).keys()).map((day) => {
        const res = {
            name: "fees",
            date: new Date(Date.now() - (6 - day) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            "fees collected": profits + getRandomInt(0, 100)
        }
        profits += res["fees collected"];
        return res
    })
    const functions = generateFunctions(10)
    console.log(feesCollectedData)
    //TODO Should make sure that the signed in account is the owner of the contracts
    return <Stack spacing={2}>
        <Typography variant={"h3"} style={{textAlign: "center"}}>Owner Dashboard</Typography>
        <Grid container xs={12} spacing={2}>
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
                        <RechartsLineChart data={feesCollectedData} dataKey={"fees collected"} xKey={"date"}
                                           yKey={"fees collected"}
                                           stroke={"#31ff87"} fill={"#31ff87"}/>
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
                            <TableCell>Available</TableCell>
                            <TableCell>Withdraw</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {functions.map((func, i) => {
                            const callsDaily = getRandomInt(2, 500);
                            const callsWeekly = callsDaily - 7;
                            return (<TableRow key={i}>
                                <TableCell><Link to={`/buy/${func.address}`}><Typography>{func.name}</Typography></Link></TableCell>
                                <TableCell><Typography>{callsDaily}</Typography></TableCell>
                                <TableCell><Typography>{callsWeekly}</Typography></TableCell>
                                {/*<TableCell><TypographyWithLinkIcon>{(callsWeekly * func.fee).toFixed(2)}</TypographyWithLinkIcon></TableCell>*/}
                                {/*<TableCell><TypographyWithLinkIcon width={25}>{(callsWeekly * func.fee * 0.05).toFixed(2)}</TypographyWithLinkIcon></TableCell>*/}
                                <TableCell><TypographyWithLinkIcon>{(callsWeekly * func.fee * 0.95).toFixed(2)}</TypographyWithLinkIcon></TableCell>
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