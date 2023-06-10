import React, {startTransition, useContext, useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardMedia,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    List,
    ListItem,
    Paper,
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
import {etherUnitsToFixed, nDaysAgoUTCInSeconds, SHORT_POLL_INTERVAL, TypographyWithLinkIcon} from "./common";
import {gql, useQuery} from "@apollo/client";
import {FunctionRegistered, Query} from "./gql/graphql";
import {BigNumberish, ethers, formatEther} from "ethers";
import ArticleIcon from '@mui/icons-material/Article';
import PaymentsIcon from '@mui/icons-material/Payments';
import {FunctionsManager} from "./generated/contract-types";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {FunctionsManagerContext} from "./FunctionsManagerProvider";
import {toast} from "react-toastify";
import {AddressCard} from "./Cards";
import {fallbackToJazzicon, jazziconImageString} from "./utils/util";

type SubscriptionRecord = {
    owner: string,
    balance: bigint,
    consumers: string[],
    reserved: bigint
}

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
                    setBal(await functionsManagerContract.getSubscriptionBalance(func.subId))
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
        fetchBal()
        const interval = setInterval(() => {
            fetchBal()
        }, 1000);
        return () => clearInterval(interval);
    }, [])
    return (<TableCell>
        <TypographyWithLinkIcon includeSuffix={false}>
            {etherUnitsToFixed(bal.valueOf())}
        </TypographyWithLinkIcon>
    </TableCell>)
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
    }).sort((a, b) => {
        return a.date > b.date ? 1 : -1
    })
    const feeData: { date: string, fees: string }[] = Object.entries(feeDataRaw).map(([date, fees]) => {
        return {
            date,
            fees: formatEther(fees)
        }
    }).sort((a, b) => {
        return a.date > b.date ? 1 : -1
    })

    return <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
            <Card sx={{paddingTop: 2, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography variant={"h4"}>Total calls</Typography>
                <RechartsLineChart data={callData} dataKey={"calls"} xKey={"date"} yKey={"calls"}
                                   stroke={"#8884d8"} fill={"#8884d8"}/>
            </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
            <Card sx={{paddingTop: 2, display: "flex", flexDirection: "column", alignItems: "center"}}>
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

const SubscriptionsTable: React.FC<{ subscriptions: BigNumberish[] }> = ({subscriptions}) => {
    const {functionsBillingRegistry, functionsManager, networkConfig, provider} = useContext(FunctionsManagerContext)
    const [subBalances, setSubBalances] = useState<{
        [key: string]: SubscriptionRecord
    }>({})
    const [selectedSub, setSelectedSub] = useState<string>("")
    const [consumersDialogOpen, setConsumersDialogOpen] = useState<boolean>(false)

    const [selectedForRefill, setSelectedForRefill] = React.useState(0n)
    const [initiateRefill, setInitiateRefill] = React.useState<boolean>(false)


    useEffect(() => {
        if (!initiateRefill) return
        const post = async () => {
            toast.info("Initiating refill...")
            try {
                const withdrawSingleTx = await functionsManager.refillSubscription(selectedForRefill, {
                    gasLimit: 1_000_000,
                })
                toast.info("Sent request, waiting for confirmation...")
                const execReceipt = await provider?.waitForTransaction(withdrawSingleTx.hash, 1);
                if (execReceipt?.status !== 1) {
                    toast.error(<Typography variant={"body1"} color={"error"}>Transaction failed
                        <a href={`${networkConfig.getScannerTxUrl(withdrawSingleTx.hash)}`} target="_blank">
                            View transaction in scanner for details...
                        </a></Typography>)
                } else {
                    toast.success("Successfully completed refill")
                }
            } catch (e: any) {
                toast.error("Encountered an error withdrawing: " + e.message)
                console.log(e.message)
            }
        }
        post()
        setInitiateRefill(false)
    }, [initiateRefill])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const balances: { [key: string]: SubscriptionRecord } = {}
                for (const sub of subscriptions) {
                    const onChainSub = await functionsBillingRegistry.getSubscription(sub)
                    const functionsManagerBalance = await functionsManager.getSubscriptionBalance(sub)
                    balances[sub.toString()] = {
                        owner: onChainSub.owner,
                        balance: onChainSub.balance,
                        consumers: onChainSub.consumers,
                        reserved: functionsManagerBalance
                    }
                }
                setSubBalances(balances)

            } catch (e: any) {
                console.error("SubscriptionTable", e)
                return
            }
        }
        fetchData()
        const interval = setInterval(() => {
            fetchData()
        }, 1000);
        return () => clearInterval(interval);
    }, [subscriptions])
    return <TableContainer component={Paper} sx={{padding: 2, width: "100%"}}>
        <Typography variant={"h4"}>My Subscriptions</Typography>

        <Dialog open={consumersDialogOpen} onClose={() => setConsumersDialogOpen(false)}>
            <DialogTitle>
                Consumers for {selectedSub}
            </DialogTitle>
            <DialogContent>
                <List>
                    {subBalances[selectedSub]?.consumers.map((consumer) => {
                        return <ListItem>{consumer}</ListItem>
                    })}
                </List>
            </DialogContent>
        </Dialog>
        <Table>
            <TableHead>
                <TableRow>

                    <TableCell><Typography>ID</Typography></TableCell>
                    <TableCell><Typography>Owner</Typography></TableCell>
                    <TableCell><Typography>Consumers</Typography></TableCell>
                    <TableCell><Typography>Reserved</Typography></TableCell>
                    <TableCell><Typography>Balance</Typography></TableCell>
                    <TableCell><Typography>Refill</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.entries(subBalances).map(([id, sub]) => {
                    return <TableRow key={id}>
                        <TableCell><Typography>{id}</Typography></TableCell>
                        <TableCell><AddressCard truncate={false} addr={sub.owner}/></TableCell>
                        <TableCell>
                            <a onClick={() => {
                                startTransition(() => {
                                    setSelectedSub(id)
                                    setConsumersDialogOpen(true)
                                })
                            }}>
                                <Typography color={"primary.main"}
                                            sx={{textDecoration: "underline"}}
                                >{sub.consumers.length}</Typography>
                            </a>
                        </TableCell>
                        <TableCell>
                            <TypographyWithLinkIcon includeSuffix={false}>
                                {etherUnitsToFixed(sub.reserved.valueOf())}
                            </TypographyWithLinkIcon>
                        </TableCell>
                        <TableCell>
                            <TypographyWithLinkIcon includeSuffix={false}>
                                {etherUnitsToFixed(sub.balance.valueOf())}
                            </TypographyWithLinkIcon>
                        </TableCell>
                        <TableCell>
                            <Button color={"secondary"} onClick={() => {
                                startTransition(() => {
                                    setSelectedForRefill(BigInt(id))
                                    setInitiateRefill(true)
                                })
                            }}>Refill</Button>
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    </TableContainer>
}


export const OwnerDashboard: React.FC = () => {

    const {account, provider, functionsManager, networkConfig} = useContext(FunctionsManagerContext)
    const [showDetails, setShowDetails] = React.useState(false)
    const [selectedForWithdrawal, setSelectedForWithdrawal] = React.useState("")
    const [initiateWithdrawSingle, setInitiateWithdrawSingle] = React.useState<boolean>(false)
    const [initiateWithdrawMulti, setInitiateWithdrawMulti] = React.useState<boolean>(false)

    const {loading, error, data} = useQuery<Query>(OWNER_DASHBOARD_QUERY, {
        variables: {
            owner: account
        },
        pollInterval: SHORT_POLL_INTERVAL
    })

    useEffect(() => {
        if (!initiateWithdrawSingle) return
        const post = async () => {
            toast.info("Initiating withdrawl...")
            try {
                const withdrawSingleTx = await functionsManager.withdrawFunctionProfitToAuthor(selectedForWithdrawal)
                const execReceipt = await provider?.waitForTransaction(withdrawSingleTx.hash, 1);
                if (execReceipt?.status !== 1) {
                    toast.error(<Typography variant={"body1"} color={"error"}>Transaction failed
                        <a href={`${networkConfig.getScannerTxUrl(withdrawSingleTx.hash)}`} target="_blank">
                            View transaction in scanner for details...
                        </a></Typography>)
                } else {
                    toast.success("Successfully completed withdrawl")
                }
            } catch (e: any) {
                toast.error("Encountered an error withdrawing: " + e.message)
                console.log(e.message)
            }
        }
        post()
        setInitiateWithdrawSingle(false)
    }, [initiateWithdrawSingle])


    useEffect(() => {
        if (!initiateWithdrawMulti) return
        const post = async () => {
            toast.info("Initiating withdrawl...")
            try {
                const ids = data?.functionRegistereds.map((f) => f.functionId)
                const withdrawMultiTx = await functionsManager.withdrawMultipleFunctionProfitToAuthor(ids || [], {gasLimit: 1000000})
                const execReceipt = await provider?.waitForTransaction(withdrawMultiTx.hash, 1);
                if (execReceipt?.status !== 1) {
                    toast.error(<Typography variant={"body1"} color={"error"}>Transaction failed
                        <a href={`${networkConfig.getScannerTxUrl(withdrawMultiTx.hash)}`} target="_blank">
                            View transaction in scanner for details...
                        </a></Typography>)
                } else {
                    toast.success("Successfully completed withdrawl")
                }
            } catch (e: any) {
                toast.error("Encountered an error withdrawing: " + e.message)
                console.log(e.message)
            }
        }
        post()
        setInitiateWithdrawMulti(false)
    }, [initiateWithdrawMulti])
    if (loading) {
        return <Typography><CircularProgress/>Loading...</Typography>
    }
    if (error) {
        console.log(error)
        return <Typography>Something went wrong</Typography>
    }

    console.log("Subs", (data?.functionRegistereds || []).map((f) => f.subId))

    const blockTimestamp = nDaysAgoUTCInSeconds(7)
    return <Stack spacing={2}>
        <Typography variant={"h3"} sx={{padding: 2, textAlign: "center"}}>Owner dashboard</Typography>
        <StatCards owner={account} blockTimestamp={blockTimestamp}/>

        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TableContainer
                    component={Paper}
                    sx={{padding: 2}}
                >
                    <Box sx={{display: "flex"}}>
                        <Typography variant={"h4"}>My Functions</Typography>
                        {<Button startIcon={<ArticleIcon/>} sx={{maxWidth: 300, marginLeft: "auto", marginRight: 1}}
                                 variant={showDetails ? "contained" : "outlined"}
                                 onClick={() => setShowDetails(!showDetails)}
                                 color={"secondary"}>
                            {showDetails ? "Hide" : "Show"} details
                        </Button>}
                        <Button startIcon={<PaymentsIcon/>} variant={"contained"} color={"secondary"} onClick={() => {
                            startTransition(() => {
                                setInitiateWithdrawMulti(true)
                            })
                        }}>Withdraw
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
                                    <TableCell>
                                        <Link to={`/buy/${func.functionId}`}
                                              style={{display: "flex", alignItems: "center"}}>
                                            <CardMedia
                                                component={"img"}
                                                sx={{width: 32, marginRight: 1}}
                                                image={func.metadata_imageUrl || jazziconImageString(func.functionId)}
                                                onError={(e) => fallbackToJazzicon(e, func.functionId)}/>
                                            <Typography>
                                                {func.metadata_name}
                                            </Typography>
                                        </Link>
                                    </TableCell>
                                    <StatsCell func={func}
                                               blockTimestamp={nDaysAgoUTCInSeconds(1).toString()}></StatsCell>
                                    <StatsCell func={func}
                                               blockTimestamp={nDaysAgoUTCInSeconds(7).toString()}></StatsCell>
                                    {showDetails && <FeeCell func={func} pool={"subscription"}
                                                             functionsManagerContract={functionsManager}/>}
                                    {showDetails && <FeeCell func={func} pool={"locked"}
                                                             functionsManagerContract={functionsManager}/>}
                                    <FeeCell func={func} pool={"unlocked"} functionsManagerContract={functionsManager}/>
                                    <TableCell>
                                        <Button color={"secondary"} onClick={() => {
                                            startTransition(() => {
                                                setSelectedForWithdrawal(func.functionId)
                                                setInitiateWithdrawSingle(true)
                                            })
                                        }}>Withdraw</Button>
                                    </TableCell>
                                </TableRow>)
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>

        <Grid container xs={12} spacing={2}>
            <Grid item xs={12}>
                <SubscriptionsTable
                    subscriptions={(data?.functionRegistereds || []).map((f) => f.subId)}></SubscriptionsTable>
            </Grid>
        </Grid>
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
