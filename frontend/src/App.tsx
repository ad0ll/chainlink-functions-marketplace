/*
App is where the router lives and where the application starts
 */
import {Container, createTheme, CssBaseline, ThemeProvider, Typography} from '@mui/material';
import React, {ReactNode} from 'react';
import {initializeConnector, useWeb3React, Web3ReactHooks, Web3ReactProvider} from "@web3-react/core";
import {MetaMask} from "@web3-react/metamask";
import {ToastContainer} from "react-toastify";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {NavBar} from "./Navbar";
import {DefaultSuspense, MUMBAI_CHAIN_ID} from "./common";
import {Home} from "./Home";
import Buy from "./Buy";
import {Sell} from "./Sell";
import Author from "./Author";
import {OwnerDashboard} from "./OwnerDashboard";
import {FunctionsManagerProvider} from "./FunctionsManagerProvider";


declare module '@mui/material/styles' {
    interface Palette {
        successGreen: Palette['primary'];
        errorRed: Palette['primary'];
        greyscale40: Palette['primary'];
    }

    interface PaletteOptions {
        successGreen: PaletteOptions['primary'];
        errorRed: PaletteOptions['primary'];
        greyscale40: PaletteOptions['primary'];
    }
}

export const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>((actions) => new MetaMask({actions}))
const connectors: [MetaMask, Web3ReactHooks][] = [
    [metaMask, metaMaskHooks],
]

const RequireConnection: React.FC<{ children: ReactNode }> = ({children}) => {
    const {isActive, chainId, account, connector} = useWeb3React()
    if (!isActive) {
        return <Typography>Please connect to MetaMask by clicking the connect button</Typography>
    } else if (chainId !== MUMBAI_CHAIN_ID) {
        return <Typography>Please change your network to Mumbai</Typography>
    } else if (!account) {
        return <Typography>Account not found</Typography>
    }

    // TODO check if account is authorized to create subscriptions
    // const Oracle = await ethers.getContractFactory("contracts/dev/functions/FunctionsOracle.sol:FunctionsOracle")
    // const oracle = await Oracle.attach(networkConfig[network.name]["functionsOracleProxy"])
    // const isWalletAllowed = await oracle.isAuthorizedSender((await ethers.getSigner()).address)
    return <>{children}</>
}

function App() {
    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                // main: '#a536e1', //This one is 400
                // main: '#d7a6f2',
                main: '#d7a6f2',
                //light: "#cb8eed", //200
                light: '#e0bbf4', //100
                // light: "#f3e4fa", //50
                dark: '#6800ce', //700
            },
            secondary: {
                // main: OFFICIAL_COLORS.green,
                main: '#31ff87',
            },
            background: {
                default: '#000',
            },
            successGreen: {
                main: '#31ff87',
            },
            errorRed: {
                main: '#ff3131',
            },
            greyscale40: {
                main: "#9ea2ab"
            }
        },
        spacing: 8
    })


    return (
        <ThemeProvider theme={theme}>
            <Web3ReactProvider connectors={connectors}>
                <ToastContainer
                    position={"bottom-right"}
                    theme={"dark"}
                    autoClose={3000}
                    pauseOnFocusLoss={false}/>
                <CssBaseline enableColorScheme/>
                <Container>
                    <BrowserRouter>
                        <NavBar/>
                        <RequireConnection>
                            <FunctionsManagerProvider>
                                <Routes>
                                    <Route path="/" element={<DefaultSuspense><Home/></DefaultSuspense>}/>
                                    <Route path="/buy/:functionId"
                                           element={<DefaultSuspense><Buy/></DefaultSuspense>}/>
                                    <Route path="/sell" element={<DefaultSuspense><Sell/></DefaultSuspense>}/>
                                    <Route path="/author/:address"
                                           element={<DefaultSuspense><Author/></DefaultSuspense>}/>
                                    <Route path="/dashboard"
                                           element={<DefaultSuspense><OwnerDashboard/></DefaultSuspense>}/>
                                </Routes>
                            </FunctionsManagerProvider>
                        </RequireConnection>
                    </BrowserRouter>
                </Container>

            </Web3ReactProvider>
        </ThemeProvider>)
}

export default App;