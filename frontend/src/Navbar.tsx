import {AppBar, Button, Fab, Toolbar, Tooltip, Typography} from "@mui/material";
import Logo from "./assets/icons/logo.svg";
import React, {useEffect} from "react";
import {useWeb3React} from "@web3-react/core";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {Link} from "react-router-dom";
import {MUMBAI_CHAIN_ID, SEPOLIA_CHAIN_ID} from "./common";
import {useCookies} from "react-cookie";

export const NavBar: React.FC = ({}) => {
    const [cookies] = useCookies(['devMode']);

    const {isActive, chainId, account, connector,} = useWeb3React()
    const [connectIcon, setConnectIcon] = React.useState(<AccountBalanceWalletIcon/>)
    const [initialLoad, setInitialLoad] = React.useState(true)
    const [tooltipText, setTooltipText] = React.useState("")

    const connectWallet = async () => {
        try {
            setTooltipText("")
            if (chainId !== MUMBAI_CHAIN_ID && chainId !== SEPOLIA_CHAIN_ID) {
                setTooltipText("Please switch to either Mumbai or Sepolia in Metamask")
            }
            await connector.activate()
        } catch (err: any) {
            setTooltipText(err.message)
        }
    }

    const disconnectWallet = async () => {
        try {
            console.log("disconnecting wallet")
            if (isActive) {

                if (connector?.deactivate) {
                    console.log("deactivating connector")
                    void connector.deactivate()
                } else {
                    console.log("resetting state")
                    void connector.resetState()
                }
            }
        } catch (err: any) {
            setTooltipText(err.message)
            // console.error(err)
        }
    }

    //
    useEffect(() => {
        if (!isActive) {
            //         // void metaMask.connectEagerly().catch((e) => {
            if (connector.connectEagerly) {
                connector?.connectEagerly()
                //             //     .catch((e: any) => {
                //             //     console.debug('Failed to connect eagerly to metamask', e)
                //             //     setConnectIcon(<ErrorOutline/>)
                //             //     setTooltipText(e)
                // })
            }
        }
    }, [])

    return (<AppBar position={"static"}>
        <Toolbar>
            <Link to={"/"} style={{display: "flex", alignItems: "center"}}>
                <Logo style={{height: 40}}/>
                <Typography variant={"h5"} style={{marginLeft: 8, display: "flex"}}>
                    Lonk
                </Typography>
            </Link>
            <Link to={"/sell"}>
                <Typography variant={"h6"} style={{marginLeft: 16}}>
                    Sell
                </Typography>
            </Link>

            <Link to={"/dashboard"}>
                <Typography variant={"h6"} style={{marginLeft: 16}}>
                    Dashboard
                </Typography>
            </Link>

            {cookies.devMode === "true" && <Fab sx={{marginLeft: "auto"}}>Dev mode enabled</Fab>}
            <Tooltip title={tooltipText} placement={"bottom"} disableHoverListener={tooltipText === ""}>
                {isActive ?
                    <Button variant={"contained"} color={"secondary"}
                            style={{marginLeft: "auto", textTransform: "none"}}
                            onClick={disconnectWallet}
                            startIcon={connectIcon}>
                        {account?.slice(0, 6) + "..." + account?.slice(account.length - 4, account.length)}
                    </Button> : <Button variant={"contained"} color={"secondary"} style={{marginLeft: "auto"}}
                                        onClick={connectWallet}
                                        startIcon={connectIcon}>
                        Connect
                    </Button>
                }
            </Tooltip>
        </Toolbar>
    </AppBar>)
}