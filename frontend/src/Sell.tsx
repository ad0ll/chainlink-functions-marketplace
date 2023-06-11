/*
The Sell page is where you can register a new Chainlink Functions based integration
 */
import React, {startTransition, useContext} from "react";
import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    SvgIcon,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {useFieldArray, useForm} from "react-hook-form";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import UsdcIcon from "./assets/icons/usd-coin-logo.svg";
import LinkIcon from "./assets/icons/link-token-blue.svg";
import {ExpectedReturnTypes, MUMBAI_CHAIN_ID, networkConfig} from "./common";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
// import FunctionsOracleJson from "./generated/abi/FunctionsOracle.json"
import {encodeBytes32String, ethers} from "ethers";
import {toast} from "react-toastify";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PublishIcon from '@mui/icons-material/Publish';
import EditIcon from '@mui/icons-material/Edit';
import {FunctionsManagerContext} from "./FunctionsManagerProvider";

type FormValues = {
    name: string,
    description: string,
    imageUrl: string,
    category: string,
    fee: number,
    feeToken: string,
    source: string,
    secretsPreEncrypted: boolean,
    suggestedGasLimit: number,
    subscriptionId: string,
    initialDeposit: string,
    expectedArgs: {
        name: string,
        type?: string,
        comment?: string
    }[],
    expectedReturnType: 0 | 1 | 2 | 3,
    codeLocation: 0,
    language: 0,
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

const getRandomExample = (chainId: typeof MUMBAI_CHAIN_ID) => {
    const examples: FormValues[] = [
        {
            name: "CoinGecko Demo " + Math.floor(Math.random() * 1000000),
            description: "Fetches the price for a given currency pair from CoinGecko",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg",
            fee: 0.05,
            expectedArgs: [
                {name: "base", type: "string", comment: "The base currency of the price pair"},
                {name: "quote", type: "string", comment: "The target currency of the price pair"},
            ],
            category: "Price Feed",
            subscriptionId: "NEW",
            source: `const base = args[0].toLowerCase();
const quote = args[1].toLowerCase();

const response = await Functions.makeHttpRequest({
    url: \`https://api.coingecko.com/api/v3/simple/price?ids=\${base}&vs_currencies=\${quote}\`,
});

const res = response.data[base][quote];

return Functions.encodeUint256(Math.round(res * 100));`,

            suggestedGasLimit: 300000,
            expectedReturnType: ExpectedReturnTypes.Uint,
            feeToken: networkConfig[chainId].linkToken,
            secretsPreEncrypted: false,
            initialDeposit: "0",
            codeLocation: 0,
            language: 0,
        }
    ]
    return examples[Math.floor(Math.random() * examples.length)];
}

export const Sell: React.FC = () => {
    const {
        account,
        provider,
        networkConfig,
        functionsManager,
        functionsBillingRegistry,
        chainId
    } = useContext(FunctionsManagerContext)
    const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false);


    const {register, handleSubmit, getValues, setValue, watch, formState, control} = useForm<FormValues>({
        defaultValues: {
            subscriptionId: "NEW",
            suggestedGasLimit: 300000,
            expectedReturnType: ExpectedReturnTypes.Bytes,
            feeToken: networkConfig.linkToken,
            secretsPreEncrypted: false,
            initialDeposit: "0",
            codeLocation: 0,
            language: 0,
        }
    });
    const {fields: args, insert, remove} = useFieldArray({
        name: "expectedArgs", // Specify the name of the array field
        control,
    });


    const errors = formState.errors;

    const onSubmit = handleSubmit(async (data) => {
        console.log("Raw form values", data)
        const post = {
            ...data,
            expectedArgs: data.expectedArgs.map(t => {
                return `${t.name};${t.type};${t.comment}`
            }),
            category: encodeBytes32String(data.category),
            fee: ethers.parseUnits(data.fee.toString()),
            expectedReturnType: data.expectedReturnType
        }

        console.log("Massaged payload", post)

        if (post.subscriptionId !== "NEW") {
            const [balance, owner, consumers] = await functionsBillingRegistry.getSubscription(post.subscriptionId);
            console.log("Fetched subscription", balance, owner, consumers)
            if (balance === BigInt(0)) {
                toast.error("Subscription does not exist or balance is Zero");
                return;
            }
            // if (owner !== account) {
            //     return;
            // }
            let authorized = owner === account || consumers.find(c => c.toLowerCase() === account.toLowerCase()) !== undefined;
            if (!authorized) {
                toast.error("Can't use a subscription unless you are the owner or an authorized consumer");
                return;
            }

            const functionsManagerExists = consumers.find(c => c.toLowerCase() === networkConfig.functionsManager.toLowerCase())
            if (!functionsManagerExists) {
                toast.info("FunctionsManager not authorized to consume subscription, adding it now...");

                const addConsumerTx = await
                    functionsBillingRegistry.addConsumer(post.subscriptionId, networkConfig.functionsManager);
                const addConsumerReceipt = await provider?.waitForTransaction(addConsumerTx.hash, 1);
                console.log("Add consumer receipt", addConsumerReceipt);
                if (addConsumerReceipt?.status === 0) {
                    toast.error("Failed to add FunctionsManager as consumer");
                    return;
                }
                toast.success("FunctionsManager added as consumer to subscription " + post.subscriptionId);
            }
            console.log("FunctionsManager is authorized consumer of function")
        }


        console.log("Final data for form: ", post);
        const registerTx = await functionsManager.registerFunction({
            functionName: post.name,
            fees: post.fee,
            desc: post.description,
            imageUrl: post.imageUrl,
            expectedArgs: post.expectedArgs,
            codeLocation: post.codeLocation,
            secretsLocation: 0, //TODO Remember this is hardcorded when secrets are added
            language: post.language,
            category: post.category,
            subId: post.subscriptionId,
            source: post.source,
            secrets: encodeBytes32String(""),
            expectedReturnType: post.expectedReturnType,
            // secrets: post.secretsPreEncrypted ? post.secrets : ethers.utils.keccak256(post.secrets)
        }, {gasLimit: "2500000"})

        toast((<div>
            <Typography>Function registration is being processed</Typography>
            <a href={`${networkConfig.getScannerTxUrl(registerTx.hash)}`}>
                View transaction in scanner...
            </a>
        </div>))

        const registerReceipt = await provider?.waitForTransaction(registerTx.hash, 1);
        if (registerReceipt?.status === 0) {
            toast.error(<div>
                <Typography>Function registration failed</Typography>
                <a href={`${networkConfig.getScannerTxUrl(registerTx.hash)}`} target="_blank">
                    View transaction in scanner for details...
                </a>
            </div>)
        } else if (registerReceipt?.status === 1) {
            // TODO get the function id and load it into this message
            toast.success(<div>
                <Typography>Successfully registered new function</Typography>
                <a href={`${networkConfig.getScannerTxUrl(registerTx.hash)}`} target="_blank">
                    View transaction in scanner for details...
                </a>
            </div>)
        } else {
            toast.error("Received unknown status from contract interaction: " + registerReceipt?.status, {toastId: 1})
        }
    });

    console.log("SubscriptionId:", watch("subscriptionId"))
    return (<Box width={{xs: "100%", sm: "80%", md: "70%", lg: "50%"}} sx={{marginTop: 2}} margin={"auto"}>
        <Typography variant={"h3"} sx={{padding: 2, textAlign: "center"}}>Create a new
            function</Typography>
        <form onSubmit={onSubmit}>
            <Stack spacing={2}>
                <Paper sx={{padding: 2}}>
                    <Stack spacing={2}>
                        <Typography variant={"h5"}>Presentation</Typography>
                        <TextField label={"Name"}
                                   fullWidth
                                   {...register("name", {required: "name is required"})}
                                   error={!!errors.name}/>
                        <TextField label={"Description"}
                                   fullWidth
                                   {...register("description", {required: "description is required", maxLength: 100})}
                                   error={!!errors.description}
                                   multiline={true} minRows={5}/>
                        <TextField label={"Image URL"}
                                   fullWidth
                                   {...register("imageUrl")}
                                   type={"url"}
                                   error={!!errors.imageUrl}/>
                        <Autocomplete
                            freeSolo
                            options={["Derivatives", "Price Feed", "Web2 API", "Web3 API"]}
                            value={watch("category")}
                            renderInput={(params) => <TextField {...params} label={"Category"}
                                                                {...register("category")}/>}
                        />
                    </Stack>
                </Paper>
                <Paper sx={{padding: 2}}>
                    <Stack spacing={2}>
                        <Typography variant={"h5"}>Execution</Typography>
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
                            <Select defaultValue={networkConfig.linkToken} sx={{width: "30%"}}>
                                <MenuItem value={networkConfig.linkToken}>
                                    <Box style={{"display": "flex", "alignItems": "center"}}>
                                        <SvgIcon component={LinkIcon} viewBox="0 0 800 800"
                                                 style={{marginRight: 4, height: 20}}/>
                                        <Typography>LINK</Typography>
                                    </Box>
                                </MenuItem>

                                {/*TODO get some USDC coin here. Use AAVE's faucet if you want*/}
                                <MenuItem value={"have no clue"} disabled>
                                    <Box style={{"display": "flex", "alignItems": "center"}}>
                                        <SvgIcon component={UsdcIcon} viewBox="0 0 2000 2000"
                                                 style={{marginRight: 4, height: 20}}/>
                                        <Typography>USDC</Typography>
                                    </Box>
                                </MenuItem>
                            </Select>
                        </Box>
                        <TextField id={"source-text"} label={"Source"}
                                   {...register("source")} multiline={true}
                                   minRows={6} error={!!errors.source}/>
                        <FormControl>
                            <InputLabel id="expectedReturnType-label">Expected return type</InputLabel>
                            <Select label={"Expected return type"}
                                    labelId={"expectedReturnType-label"}
                                    defaultValue={0}
                                    {...register("expectedReturnType")}
                                    error={!!errors.expectedReturnType}>
                                <MenuItem value={0}>bytes</MenuItem>
                                <MenuItem value={1}>uint</MenuItem>
                                <MenuItem value={2}>int</MenuItem>
                                <MenuItem value={3}>string</MenuItem>
                            </Select>
                        </FormControl>
                        {/*TODO use gray color for border by default and make it white if any control is focused or the mouse is hovering*/}
                        <Stack
                            spacing={2}>
                            <Box display={"flex"}>
                                <Typography variant={"subtitle1"}>Arguments</Typography>
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
                            {args.map((arg, i) => (<Grid container>
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

                    </Stack>
                </Paper>

                {showAdvanced && <Paper sx={{padding: 2}}>
                    <Stack spacing={2}>
                        <Typography variant={"h5"}>Advanced</Typography>

                        <FormControl>
                            <InputLabel id="codeLocation-label">Code location</InputLabel>
                            <Select defaultValue={0}
                                    label={"Code location"}
                                    labelId={"codeLocation-label"}
                                    {...register("codeLocation")}>
                                <MenuItem value={0}>Inline</MenuItem>
                                <MenuItem value={1} disabled>Remote</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="language-label">Source code language</InputLabel>
                            <Select defaultValue={0}
                                    label={"Source code language"}
                                    labelId={"language-label"}
                                    {...register("language")}>
                                <MenuItem value={0}>JavaScript</MenuItem>
                            </Select>
                        </FormControl>
                        <Tooltip title={"This field cannot be changed in the current version of the Marketplace"}>
                            <TextField id={"suggested-gas-limit-text"}
                                       inputProps={{
                                           endAdornment:
                                               <Tooltip
                                                   title={"Cannot be changed in the current version of the marketplace"}>
                                                   <HelpOutlineIcon/>
                                               </Tooltip>
                                       }}
                                       disabled
                                       label={"Callback gas limit"} {...register("suggestedGasLimit")}
                                       error={!!errors.suggestedGasLimit}/>
                        </Tooltip>
                        <TextField id={"subscription-id-text"}
                                   label={"Subscription ID"} {...register("subscriptionId")}
                                   error={!!errors.subscriptionId}/>

                        {watch("subscriptionId") !== "NEW"
                            ? (<Tooltip
                                title={"You can't set this unless you're creating a new subscription (set \"Subscription ID\" to \"NEW\""}>
                                <TextField id={"initial-deposit-text"}
                                           label={"Initial deposit"} {...register("initialDeposit")}
                                           disabled
                                           error={!!errors.initialDeposit}/>
                            </Tooltip>)
                            : <TextField id={"initial-deposit-text"}
                                         label={"Initial deposit"} {...register("initialDeposit")}
                                         error={!!errors.initialDeposit}/>}
                    </Stack>
                </Paper>
                }
                <Button startIcon={showAdvanced ? <ExpandLessIcon/> : <ExpandMoreIcon/>} color={"primary"}
                        variant={"outlined"} sx={{width: "100%"}}
                        onClick={() => setShowAdvanced(!showAdvanced)}>
                    {showAdvanced ? "Hide" : "Show"} advanced options</Button>

                <Button startIcon={<EditIcon/>} variant={"outlined"} color={"primary"} onClick={() => {
                    const example = getRandomExample(chainId)
                    startTransition(() => {
                        setValue("name", example.name)
                        setValue("description", example.description)
                        setValue("imageUrl", example.imageUrl)
                        setValue("source", example.source)
                        setValue("category", example.category)
                        setValue("fee", example.fee)
                        setValue("expectedReturnType", example.expectedReturnType)
                        setValue("expectedArgs", example.expectedArgs)
                        setValue("suggestedGasLimit", example.suggestedGasLimit)
                        setValue("subscriptionId", example.subscriptionId)
                        setValue("initialDeposit", example.initialDeposit)
                        //
                        // Object.keys(example).forEach((key)  => {
                        //     setValue(key, example[key])
                        // })
                    })
                }}>
                    Pre-fill Example
                </Button>
                <Button type={"submit"} startIcon={<PublishIcon/>} variant={"contained"}
                        color={"primary"}>Submit</Button>
            </Stack>
            {/* TODO Add secrets */}
        </form>
    </Box>)
}

