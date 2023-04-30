// Code for the form used to create a new function
import React from "react";
import {Autocomplete, Box, Button, MenuItem, Select, Stack, SvgIcon, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LogoIcon from "./icons/logo.svg";
import UsdcIcon from "./icons/usd-coin-logo.svg";
import LinkIcon from "./icons/link-token-blue.svg";
import {networkConfig} from "./common";

type FormValues = {
    name: string,
    description: string,
    imageUrl: string,
    functionType: string,
    fee: number,
    feeToken: number,
    source: string,
    secretsPreEncrypted: boolean,
    suggestedGasLimit: number,
    subscriptionId: string,
    oracle: string,
    initialDeposit: string,
}

/*
TODO validation
name not empty
description not empty, put some character limit on it (idk 250?)
imageUrl optional, should be url, try accessing it
One of functionTypePreset (baked in list) and functionTypeNew (user provided) not empty
fee not empty, should be number, must be > 0
feeToken is USD, ETH, or LINK
(STRETCH) source should run through javascript interpreter to check for syntax errors
Subscription ID is optional, should be uint64
gasLimit is optional, should be uint32
oracle is optional, should be address, can prefill with "networkConfig.[network].functionsOracleProxy"
initial deposit should be number, use ethers.ParseUnits for validation
 */

export const Sell: React.FC = () => {
    const {register, handleSubmit, watch, formState} = useForm<FormValues>({
        defaultValues: {
            subscriptionId: "NEW",
            suggestedGasLimit: 500000,
            oracle: networkConfig.mumbai.functionsOracleProxy,
            initialDeposit: "1"
        }
    });
    const errors = formState.errors;
    const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false);

    const onSubmit = handleSubmit(async (data) => {
        console.log(data)
    });
    // return (<Paper width={{xs: "100%", sm: "80%", md: "60%", lg: "40%"}} sx={{marginTop: 2}} margin={"auto"}>
    return (<Box width={{xs: "100%", sm: "80%", md: "60%", lg: "40%"}} sx={{marginTop: 2}} margin={"auto"}>
        <Typography variant={"h4"} color={"secondary"} sx={{padding: 2, textAlign: "center"}}>Create a new
            function</Typography>
        <form onSubmit={onSubmit}>
            <Stack spacing={2}>
                <TextField label={"Name"}
                           {...register("name", {required: "name is required"})}
                           error={!!errors.name}/>
                <TextField label={"Description"}
                           {...register("description")}
                           error={!!errors.description}
                           multiline={true} minRows={3}/>
                <TextField label={"Image URL"}
                           {...register("imageUrl")}
                           error={!!errors.imageUrl}/>
                <Autocomplete
                    freeSolo
                    options={["Derivatives", "Price Feed", "Web2 API", "Web3 API"]}
                    renderInput={(params) => <TextField {...params} label={"Type"} {...register("functionType")}/>}
                />
                {/*Could emulate uniswap for LINK/USDC control instead of having two controls: https://github.com/Uniswap/interface/blob/d0a10fcf8dce6d8f9b1c06c0f640921b7d5ab33b/src/components/CurrencyInputPanel/SwapCurrencyInputPanel.tsx#L55*/}
                <Box>
                    <TextField label={"Fee"} id={"fee-text"}
                               {...register("fee", {required: "Please submit a fee", validate: (v) => v > 0})}
                               error={!!errors.fee}
                               sx={{width: "70%"}}
                    />
                    {/*TODO fix hardcoding of networks/values below*/}
                    <Select defaultValue={networkConfig.mumbai.linkToken} sx={{width: "30%"}}>
                        <MenuItem value={networkConfig.mumbai.linkToken}>
                            <Box style={{"display": "flex", "alignItems": "center"}}>
                                <SvgIcon component={LinkIcon} viewBox="0 0 800 800" style={{marginRight: 4, height: 20}}/>
                                <Typography>LINK</Typography>
                            </Box>
                        </MenuItem>

                        <MenuItem value={"have no clue"}>
                            <Box style={{"display": "flex", "alignItems": "center"}}>
                            <SvgIcon component={UsdcIcon} viewBox="0 0 2000 2000" style={{marginRight: 4, height: 20}}/>
                            <Typography>USDC</Typography>
                            </Box>
                        </MenuItem>
                    </Select>
                </Box>
                <TextField id={"source-text"} label={"Source"} {...register("source")} multiline={true}
                           minRows={6} error={!!errors.source}/>
                {showAdvanced
                    ? <Button startIcon={<ExpandLessIcon/>} color={"secondary"} sx={{width: "100%"}}
                              onClick={() => setShowAdvanced(!showAdvanced)}>
                        Hide advanced options</Button>
                    : <Button startIcon={<ExpandMoreIcon/>} color={"secondary"} sx={{width: "100%"}}
                              onClick={() => setShowAdvanced(!showAdvanced)}>
                        Show advanced options</Button>
                }
                {showAdvanced &&
                    <TextField id={"suggested-gas-limit-text"}
                               label={"Suggested Gas Limit"} {...register("suggestedGasLimit")}
                               error={!!errors.suggestedGasLimit}/>}
                {showAdvanced &&
                    <TextField id={"subscription-id-text"}
                               label={"Subscription ID"} {...register("subscriptionId")}
                               error={!!errors.subscriptionId}/>}
                {showAdvanced &&
                    <TextField id={"initial-deposit-text"}
                               label={"Initial Deposit"} {...register("initialDeposit")}
                               error={!!errors.initialDeposit}/>}
                {showAdvanced &&
                    <TextField id={"oracle-text"} label={"Oracle"} {...register("oracle")} error={!!errors.oracle}/>}
                <Button type={"submit"} variant={"contained"} color={"primary"}>Submit</Button>
            </Stack>
            {/* TODO Add secrets */}
            {/* TODO Add args */}
        </form>
    </Box>)
}

