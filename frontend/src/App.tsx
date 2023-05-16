import {Container, createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import React from 'react';
import {initializeConnector, Web3ReactHooks, Web3ReactProvider} from "@web3-react/core";
import {MetaMask} from "@web3-react/metamask";
import {ToastContainer} from "react-toastify";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {NavBar} from "./Navbar";
import {DefaultSuspense} from "./common";
import {Home} from "./Home";
import Buy from "./Buy";
import {Sell} from "./Sell";
import Author from "./Author";
import {OwnerDashboard} from "./OwnerDashboard";


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

function App() {
    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#a536e1', //This one is 400
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


    return (<ThemeProvider theme={theme}>
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
                    <Routes>
                        <Route path="/" element={<DefaultSuspense><Home/></DefaultSuspense>}/>
                        <Route path="/buy/:functionId" element={<DefaultSuspense><Buy/></DefaultSuspense>}/>
                        <Route path="/sell" element={<DefaultSuspense><Sell/></DefaultSuspense>}/>
                        <Route path="/author/:ownerAddress" element={<DefaultSuspense><Author/></DefaultSuspense>}/>
                        <Route path="/dashboard"
                               element={<DefaultSuspense><OwnerDashboard/></DefaultSuspense>}/>
                    </Routes>
                </BrowserRouter>
            </Container>
        </Web3ReactProvider>
    </ThemeProvider>);
}

export default App;