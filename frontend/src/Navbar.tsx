import {AppBar, Button, Toolbar, Tooltip, Typography} from "@mui/material";
import Logo from "./assets/icons/logo.svg";
import React, {startTransition} from "react";
import {useWeb3React} from "@web3-react/core";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {Link} from "react-router-dom";
import {ErrorOutline} from "@mui/icons-material";

export const NavBar: React.FC = ({}) => {

    const {isActive, isActivating, chainId, hooks, account, provider, connector, ENSName, ENSNames} = useWeb3React()
    const [connectIcon, setConnectIcon] = React.useState(<AccountBalanceWalletIcon/>)
    const [initialLoad, setInitialLoad] = React.useState(true)
    const [tooltipText, setTooltipText] = React.useState("")

    const connectWallet = async () => {
        try {
            setTooltipText("")
            await connector.activate()
        } catch (err: any) {
            startTransition(() => {
                console.log("setting error", err.message)
                setTooltipText(err.message)
                //TODO set to error color
                // setConnectIcon(<ErrorOutline color={"primary"}/>)
                setConnectIcon(<ErrorOutline/>)
            })
        }
    }

    const disconnectWallet = async () => {
        try {
            if (isActive) {
                await connector?.deactivate?.()
            }
        } catch (err) {
            console.error(err)
        }
    }
    if (initialLoad) {
        connectWallet()
        setInitialLoad(false)
    }

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
            <Link to={"/dashboard/:owner"}>
                <Typography variant={"h6"} style={{marginLeft: 16}}>
                    Dashboard
                </Typography>
            </Link>
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