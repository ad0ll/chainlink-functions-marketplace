// Code for the form used to create a new function
import React from "react";
import {
    Autocomplete,
    Box,
    Button,
    Grid,
    IconButton,
    MenuItem,
    Select,
    Stack,
    SvgIcon,
    TextField,
    Typography
} from "@mui/material";
import {useFieldArray, useForm} from "react-hook-form";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import UsdcIcon from "./assets/icons/usd-coin-logo.svg";
import LinkIcon from "./assets/icons/link-token-blue.svg";
import {MUMBAI_CHAIN_ID, networkConfig, SEPOLIA_CHAIN_ID} from "./common";
import {useWeb3React} from "@web3-react/core";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FunctionsManagerJson from "./generated/abi/FunctionsManager.json"
import FunctionsOracleJson from "./generated/abi/FunctionsOracle.json"
import {FunctionsManager, FunctionsOracle} from "./generated/contract-types";
import {useContract} from "./contractHooks";
import {encodeBytes32String, ethers} from "ethers";
import {toast} from "react-toastify";


type FormValues = {
    name: string,
    description: string,
    imageUrl: string,
    category: string,
    fee: number,
    feeToken: number,
    source: string,
    secretsPreEncrypted: boolean,
    suggestedGasLimit: number,
    subscriptionId: string,
    oracle: string,
    initialDeposit: string,
    expectedArgs: {
        name: string,
        type?: string,
        comment?: string
    }[]
}

/*
TODO validation
--name not empty
-- description not empty, put some character limit on it (idk 250?)
imageUrl optional, should be url, stretch, try accessing it
Allow usage of preexisting categories or new ones
-- fee not empty, should be number, must be > 0
-- feeToken is USDC or LINK
(STRETCH) source should run through javascript interpreter to check for syntax errors
Subscription ID is required, either "NEW" or uint64.
gasLimit is optional, should be uint32
-- oracle is required, should be address, can prefill with "networkConfig.[network].functionsOracleProxy"
initial deposit should be number, use ethers.ParseUnits for validation
 */

export const Sell: React.FC = () => {
    const {account, chainId, provider} = useWeb3React();
    const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false);
    const {register, handleSubmit, getValues, setValue, watch, formState, control} = useForm<FormValues>({
        defaultValues: {
            // subscriptionId: "NEW",
            // suggestedGasLimit: 500000,
            // oracle: networkConfig[chainId].functionsOracleProxy,
            // initialDeposit: "3", //Whole LINK units, conversion happens later

            name: "Test" + Math.floor(Math.random() * 1000000),
            description: "This is a test function that I am creating",
            imageUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=025",
            fee: 0.05,
            expectedArgs: [
                {name: "test", type: "uint8", comment: "This is a test parameter"},
                {name: "test2", type: "uint256", comment: "This is test parameter2"},
                {name: "test2", type: "string", comment: "This is test parameter3"}
            ],
            category: encodeBytes32String("Test Category"),
            subscriptionId: "941",
            source: "console.log('Hello world!')",
        }
    });

    const {fields: args, insert, remove} = useFieldArray({
        name: "expectedArgs", // Specify the name of the array field
        control,
    });

    if (!chainId) {
        return <Typography>Could not get chain id from the connected wallet</Typography>
    } else if (chainId !== MUMBAI_CHAIN_ID && chainId !== SEPOLIA_CHAIN_ID) {
        return <Typography>Wrong chain id. Please connect to Mumbai or Sepolia</Typography>
    }

    const functionsManagerContract = useContract(networkConfig[chainId].realFunctionsManager, FunctionsManagerJson.abi) as unknown as FunctionsManager;
    const oracleProxyContract = useContract(networkConfig[chainId].functionsOracleProxy, FunctionsOracleJson.abi) as unknown as FunctionsOracle;


    const errors = formState.errors;


    const onSubmit = handleSubmit(async (data) => {
        const post = {
            ...data,
            expectedArgs: data.expectedArgs.map(t => {
                return `${t.name}:${t.type}:${t.comment}`
            }),
            fee: ethers.parseUnits(data.fee.toString()),

        }


        // TODO if sub is new, check that user is registered.
        console.log("Final data for form: ", post);
        const registerTx = await functionsManagerContract.registerFunction({
            functionName: post.name,
            fees: post.fee,
            desc: post.description,
            imageUrl: post.imageUrl,
            expectedArgs: post.expectedArgs,
            codeLocation: 0,
            secretsLocation: 0,
            language: 0,
            category: post.category,
            subId: post.subscriptionId,
            source: post.source,
            secrets: encodeBytes32String(""),
            // secrets: post.secretsPreEncrypted ? post.secrets : ethers.utils.keccak256(post.secrets)
        }, {gasLimit: "1000000"})

        console.log("Register TX:", registerTx)
        // toast((<div>
        //     <Typography>Function registration is being processed</Typography>
        //     <Link to={`${networkConfig[chainId].getScannerTxUrl(registerTx.hash)}`}>
        //         View transaction in scanner...
        //     </Link>
        // </div>), {autoClose: false, toastId: 1})

        const registerReceipt = await provider?.waitForTransaction(registerTx.hash, 1);
        if (registerReceipt?.status === 0) {
            toast.error(<div>
                <Typography>Function registration failed</Typography>
                <a href={`${networkConfig[chainId].getScannerTxUrl(registerTx.hash)}`} target="_blank">
                    View transaction in scanner for details...
                </a>
            </div>, {toastId: 1})
        } else if (registerReceipt?.status === 1) {
            // TODO get the function id and load it into this message
            toast.success(<div>
                <Typography>Successfully registered new function</Typography>
                <a href={`${networkConfig[chainId].getScannerTxUrl(registerTx.hash)}`} target="_blank">
                    View transaction in scanner for details...
                </a>
            </div>, {toastId: 1})
        } else {
            toast.error("Received unknown status from contract interaction: " + registerReceipt?.status, {toastId: 1})
        }

        // const registerReceipt = await registerTx.wait();
        //Doing registerTx.wait() returns an error:
        // console.log("Register receipt: ", registerReceipt);
        // console.log("Register events: ", events);

        // functionsManagerContract
        // console.log(functionsManagerContract.interface.decodeEventLog(functionsManagerContract.interface.getEvent("FunctionRegistered"), registerReceipt?.logs?.[0]?.data || "", registerReceipt?.logs?.[0]?.topics))
        // console.log(functionsManagerContract.interface.decodeEventLog(functionsManagerContract.interface.getEvent("FunctionRegistered"), )
    });


    // return (<Paper width={{xs: "100%", sm: "80%", md: "60%", lg: "40%"}} sx={{marginTop: 2}} margin={"auto"}>
    return (<Box width={{xs: "100%", sm: "80%", md: "70%", lg: "50%"}} sx={{marginTop: 2}} margin={"auto"}>
        <Typography variant={"h4"} sx={{padding: 2, textAlign: "center"}}>Create a new
            function</Typography>
        <form onSubmit={onSubmit}>
            <Stack spacing={2}>
                <TextField label={"Name"}
                           {...register("name", {required: "name is required"})}
                           error={!!errors.name}/>
                <TextField label={"Description"}
                           {...register("description", {required: "description is required", maxLength: 100})}
                           error={!!errors.description}
                           multiline={true} minRows={3}/>
                <TextField label={"Image URL"}
                           {...register("imageUrl")}
                           error={!!errors.imageUrl}/>
                <Autocomplete
                    freeSolo
                    options={["Derivatives", "Price Feed", "Web2 API", "Web3 API"]}
                    renderInput={(params) => <TextField {...params} label={"Type"} {...register("category")}/>}
                />

                {/*Could emulate uniswap for LINK/USDC control instead of having two controls: https://github.com/Uniswap/interface/blob/d0a10fcf8dce6d8f9b1c06c0f640921b7d5ab33b/src/components/CurrencyInputPanel/SwapCurrencyInputPanel.tsx#L55*/}
                <Box>
                    {/*TODO add an inline USDC estimate to the right*/}
                    <TextField label={"Fee"} id={"fee-text"}
                               {...register("fee", {required: "Please submit a fee", validate: (v) => v > 0})}
                               error={!!errors.fee}
                               sx={{width: "70%"}}
                               type={"number"}
                               inputProps={{
                                   step: 0.01,
                               }}
                    />
                    <Select defaultValue={networkConfig[chainId].linkToken} sx={{width: "30%"}}>
                        <MenuItem value={networkConfig[chainId].linkToken}>
                            <Box style={{"display": "flex", "alignItems": "center"}}>
                                <SvgIcon component={LinkIcon} viewBox="0 0 800 800"
                                         style={{marginRight: 4, height: 20}}/>
                                <Typography>LINK</Typography>
                            </Box>
                        </MenuItem>

                        {/*TODO get some USDC coin here. Use AAVE's faucet if you want*/}
                        <MenuItem value={"have no clue"}>
                            <Box style={{"display": "flex", "alignItems": "center"}}>
                                <SvgIcon component={UsdcIcon} viewBox="0 0 2000 2000"
                                         style={{marginRight: 4, height: 20}}/>
                                <Typography>USDC</Typography>
                            </Box>
                        </MenuItem>
                    </Select>
                </Box>
                <TextField id={"source-text"} label={"Source"} {...register("source")} multiline={true}
                           minRows={6} error={!!errors.source}/>
                {/*TODO use gray color for border by default and make it white if any control is focused or the mouse is hovering*/}
                <Stack sx={{
                    border: "1px",
                    borderStyle: "solid",
                    borderColor: "white",
                    borderRadius: 1,
                    padding: 2
                }}
                       spacing={2}>
                    <Box display={"flex"}>
                        <Typography variant={"h6"}>Arguments</Typography>
                        {/*Add elem to args to kick off controls in map function below*/}
                        {args.length === 0 && <Button sx={{marginLeft: "auto"}} startIcon={<AddIcon/>}
                                                      variant={"outlined"}
                                                      color={"secondary"}
                                                      onClick={() => insert(0, {
                                                          name: "",
                                                          type: "string",
                                                          comment: ""
                                                      })}>Add</Button>}
                    </Box>
                    {args.map((arg, i) => (<Grid container xs={12}>
                        <Grid item xs={7}>
                            <TextField fullWidth id={"arg-" + i + "-text"} label={"Argument " + i}
                                       {...register(`expectedArgs.${i}.name`, {required: "Please provide a name for your variable"})}
                                       error={!!errors.expectedArgs?.[i]}/>
                        </Grid>
                        <Grid item xs={3}>
                            <Select fullWidth id={"arg-" + i + "-type-text"} label={"Type (optional)"}
                                    defaultValue={"string"}
                                    {...register(`expectedArgs.${i}.type`)}>
                                <MenuItem value={"string"}>string</MenuItem>
                                <MenuItem value={"address"}>address</MenuItem>
                                <MenuItem value={"bool"}>bool</MenuItem>
                                <MenuItem value={"bytes32"}>bytes32</MenuItem>
                                <MenuItem value={"int8"}>int8</MenuItem>
                                <MenuItem value={"int16"}>int16</MenuItem>
                                <MenuItem value={"int32"}>int32</MenuItem>
                                <MenuItem value={"int64"}>int64</MenuItem>
                                <MenuItem value={"int128"}>int128</MenuItem>
                                <MenuItem value={"int256"}>int256</MenuItem>
                                <MenuItem value={"uint8"}>uint8</MenuItem>
                                <MenuItem value={"uint16"}>uint16</MenuItem>
                                <MenuItem value={"uint32"}>uint32</MenuItem>
                                <MenuItem value={"uint64"}>uint64</MenuItem>
                                <MenuItem value={"uint128"}>uint128</MenuItem>
                                <MenuItem value={"uint256"}>uint256</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={2}>
                            {/*TODO Colors below are messed up*/}
                            <Box display={"flex"} alignItems={"center"}>
                                <IconButton color={"secondary"}
                                            onClick={() => {
                                                insert(i + 1, {name: "", type: "string", comment: ""})
                                            }}><AddIcon/></IconButton>
                                <IconButton color={"secondary"}
                                            onClick={() => remove(i)}><RemoveIcon/></IconButton>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label={"Comment (optional)"}
                                       {...register(`expectedArgs.${i}.comment`)}
                            />
                        </Grid>
                    </Grid>))}
                </Stack>
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
                <Button type={"submit"} variant={"contained"} color={"primary"}>Submit</Button>
                {showAdvanced &&
                    <TextField id={"oracle-text"} label={"Oracle"} {...register("oracle")} error={!!errors.oracle}/>}

                {/*<Button type={"submit"} variant={"contained"} color={"primary"}>Pre-fill</Button>*/}

            </Stack>
            {/* TODO Add secrets */}
        </form>
    </Box>)
}

