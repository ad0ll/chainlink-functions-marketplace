import React, {useEffect, useState} from "react";
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
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip as RechartTooltip, XAxis, YAxis} from "recharts";
import {MUMBAI_CHAIN_ID, nDaysAgoUTCInSeconds, networkConfig, SEPOLIA_CHAIN_ID, SHORT_POLL_INTERVAL} from "./common";
import {gql, useQuery} from "@apollo/client";
import {FunctionRegistered, Query} from "./gql/graphql";
import {BigNumberish, ethers, formatEther} from "ethers";
import ArticleIcon from '@mui/icons-material/Article';
import {useWeb3React} from "@web3-react/core";
import PaymentsIcon from '@mui/icons-material/Payments';
import FunctionsManagerJson from "./generated/abi/FunctionsManager.json";
import {FunctionsManager} from "./generated/contract-types";
import {useContract} from "./contractHooks";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const OWNER_DASHBOARD_QUERY = gql`
    query EventSpammerOwnerPage($owner: Bytes!){
        functionRegistereds(
            orderBy: blockTimestamp
            orderDirection: desc
            where: {
                owner: $owner
            }
        ){
            id
            functionId
            owner
            blockTimestamp
            fee
            subId
            metadata_name
            metadata_imageUrl
            #            metadata_subscriptionPool
            #            metadata_lockedProfitPool
            #            metadata_unlockedProfitPool
        }
    }`


//TODO below should be functionCallCompleteds, but we aren't producing those yet
const OWNER_DASHBOARD_STATS_QUERY = gql`
    query EventSpammerOwnerPageCounts($functionId: Bytes!, $blockTimestamp_gt: BigInt!){
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
        },
        // TODO Swap this out for a subscription if there's time
        pollInterval: SHORT_POLL_INTERVAL
    })
    if (loading) {
        return <TableCell><Typography><CircularProgress/>Loading...</Typography></TableCell>
    }
    if (error) {
        return <TableCell><Typography>Something went wrong</Typography></TableCell>
    }

    //TODO Below should be functionCallCompleteds, but we aren't producing those yet
    return (<TableCell><Typography>{data?.functionCalleds.length ?? 0}</Typography></TableCell>)
}

const FeeCell: React.FC<{
    func: FunctionRegistered,
    pool: "subscription" | "locked" | "unlocked",
    functionsManagerContract: FunctionsManager
}> = ({func, pool, functionsManagerContract}) => {

    const [bal, setBal] = useState<BigInt>(BigInt(0))
    useEffect(() => {
        const fetchBal = async () => {
            switch (pool) {
                case "subscription":
                    setBal(await functionsManagerContract.getSubscriptionBalance(func.functionId))
                    break
                case "locked":
                    const metaLock = await functionsManagerContract.getFunctionExecuteMetadata(func.functionId)
                    setBal(metaLock.lockedProfitPool)
                    break
                case "unlocked":
                    const metaUnlock = await functionsManagerContract.getFunctionExecuteMetadata(func.functionId)
                    setBal(metaUnlock.unlockedProfitPool)
                    break
            }
        }
        const interval = setInterval(() => {
            fetchBal()
        }, 1000);
        return () => clearInterval(interval);
    }, [])
    return <TableCell>
        <Typography>
            {formatEther(bal.toString())}
        </Typography>
    </TableCell>
}
const StatCards: React.FC<{ owner: string, blockTimestamp: BigNumberish }> = ({
                                                                                  owner,
                                                                                  blockTimestamp
                                                                              }) => {

    const {loading, error, data} = useQuery<Query>(OWNER_DASHBOARD_STATS_TOP_QUERY, {
        variables: {
            owner: owner,
            blockTimestamp_gt: blockTimestamp,
        },
        pollInterval: SHORT_POLL_INTERVAL
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
            <Card sx={{paddingTop: 2, display: "flex", flexDirection: "column", alignItems: "center"}} elevation={4}>
                <Typography variant={"h4"}>Total calls</Typography>
                <RechartsLineChart data={callData} dataKey={"calls"} xKey={"date"} yKey={"calls"}
                                   stroke={"#8884d8"} fill={"#8884d8"}/>
            </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
            <Card sx={{paddingTop: 2, display: "flex", flexDirection: "column", alignItems: "center"}} elevation={4}>
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

    const {account, chainId} = useWeb3React()
    const [showDetails, setShowDetails] = React.useState(false)
    const [withdrawing, setWithdrawing] = React.useState(false)
    if (chainId !== MUMBAI_CHAIN_ID && chainId !== SEPOLIA_CHAIN_ID) {
        return <Typography>Unsupported network</Typography>
    }
    if (!account) {
        return <Typography>Connect your wallet to view your dashboard</Typography>
    }
    const functionsManagerContract = useContract(networkConfig[chainId].functionsManager, FunctionsManagerJson.abi) as unknown as FunctionsManager
    const {loading, error, data} = useQuery<Query>(OWNER_DASHBOARD_QUERY, {
        variables: {
            owner: account
        },
        pollInterval: SHORT_POLL_INTERVAL
    })
    if (loading) {
        return <Typography><CircularProgress/>Loading...</Typography>
    }
    if (error) {
        console.log(error)
        return <Typography>Something went wrong</Typography>
    }
    console.log(data)

    const blockTimestamp = nDaysAgoUTCInSeconds(7)
    return <Stack spacing={2}>
        <Typography variant={"h3"} sx={{padding: 2, textAlign: "center"}}>Owner dashboard</Typography>
        <StatCards owner={account} blockTimestamp={blockTimestamp}/>

        <TableContainer sx={{border: "1px solid white", padding: 2}}>
            <Box sx={{border: "1px solid primary.main", display: "flex"}}>
                <Typography variant={"h4"}>My Functions</Typography>
                {<Button startIcon={<ArticleIcon/>} sx={{maxWidth: 300, marginLeft: "auto", marginRight: 1}}
                         variant={showDetails ? "contained" : "outlined"} onClick={() => setShowDetails(!showDetails)}
                         color={"secondary"}>
                    {showDetails ? "Hide" : "Show"} details
                </Button>}
                <Button startIcon={<PaymentsIcon/>} variant={"contained"} color={"secondary"}>Withdraw
                    All</Button>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><Typography>Name</Typography></TableCell>
                        <TableCell><Typography>Calls 24h</Typography></TableCell>
                        <TableCell><Typography>Calls 7d</Typography></TableCell>
                        {showDetails && <TableCell>
                            <Tooltip
                                title={"These funds cover the base fee that must be paid by your subscription when making a call to Chainlink Functions. They will be transferred over to your subscription automatically when it runs low. You can't withdraw these funds manually without deleting your listing."}>
                                <Typography>Reserved<HelpOutlineIcon/></Typography>
                            </Tooltip>
                        </TableCell>}
                        {showDetails && <TableCell>
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
                            {showDetails && <FeeCell func={func} pool={"subscription"}
                                                     functionsManagerContract={functionsManagerContract}/>}
                            {showDetails && <FeeCell func={func} pool={"locked"}
                                                     functionsManagerContract={functionsManagerContract}/>}
                            <FeeCell func={func} pool={"unlocked"} functionsManagerContract={functionsManagerContract}/>
                            <TableCell>
                                <Button color={"secondary"} onClick={() => {
                                    functionsManagerContract.withdrawFunctionProfitToAuthor(func.functionId)
                                }}>Withdraw</Button>
                            </TableCell>
                        </TableRow>)
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </Stack>
}


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
