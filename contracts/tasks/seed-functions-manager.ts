import {task, types} from "hardhat/config";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import fs from "fs";
import {FunctionsManager} from "../typechain-types";


task("seed-functions-manager", "runs a function")
    .addOptionalParam(
        "functionsmanager",
        "The address of the function manager",
        process.env.FUNCTION_MANAGER_ADDR,
        types.string
    )
    .addOptionalParam(
        "registerfunctions",
        "Whether to register functions",
        true,
        types.boolean
    )
    .addOptionalParam(
        "numrunsfloor",
        "The minimum number of times to run each demo",
        1,
        types.int
    )
    .addOptionalParam(
        "numruns",
        "The number of times to each demo the function",
        5,
        types.int
    )
    .setAction(async (taskArgs, {ethers}) => {

        console.log("Building demos")

        const imageUrls = {
            maxHeadroom: "https://i.imgur.com/VE7uGB9.gif",
            //TODO Swap below with the official version (Google Drive link: https://drive.google.com/drive/folders/1owvdEhRDtmwxE-7cAdxBXhjswiDPDT9W) uploaded on the vercel app since we can't get a direct link from google drive..
            coingecko: "https://i.pinimg.com/736x/be/c9/b3/bec9b33d6638ff927a96d0e93546a056.jpg",
            calculateApy: "https://upload.wikimedia.org/wikipedia/commons/1/18/Simple_calculator.svg",
            ethLogo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg"

        }

        const extractSourceFromDemo = (demoPath: string) => {
            const content = fs.readFileSync(demoPath, "utf-8").toString()
            let start = -1
            let end = -1
            content.split("\n").forEach((line, i) => {
                if (line.match(".*BEGIN[ _]SRC.*")) {
                    start = i
                } else if (line.match(".*END[ _]SRC.*")) {
                    end = i
                }
            })
            if (start === -1 || end === -1) {
                throw new Error("Could not find start or end of snippet")
            }
            return content.split("\n").slice(start, end).join("\n")
        }

        type DemoConfig = {
            file: string,
            register: FunctionsManager.FunctionsRegisterRequestStruct,
            execute: {
                validArgs: string[][],
                gasLimit: number
            }
        }
        const demos: DemoConfig[] = [{
            file: "./demos/coingecko-price.ts",
            register: {
                fees: BigInt(10 ** 18 / 100 * 5),
                functionName: "CoinGecko Price",
                desc: "Fetches a given price pair from CoinGecko",
                imageUrl: imageUrls.coingecko,
                expectedArgs: [
                    "base;string;See the following for all possible values: https://api.coingecko.com/api/v3/coins/list",
                    "quote;string;See the following for all possible values: https://api.coingecko.com/api/v3/coins/list"],
                codeLocation: 0,
                secretsLocation: 0,
                language: 0,
                category: ethers.utils.formatBytes32String("Price Feed"),
                subId: 0, //TODO fix this, it'll break when you run in prod
                source: extractSourceFromDemo("./demos/coingecko-price.ts"),
                secrets: []
            },
            execute: {
                validArgs: [
                    ["ethereum", "usd"],
                    ["bitcoin", "usd"],
                    ["ripple", "jpy"],
                    ["ethereum", "eur"],
                ],
                gasLimit: 500_000
            },
        }]


        console.log("Finished bootstrapping demos")

        const getFunctionId = (types: string[], values: any[]) => {
            console.log("Types: ", types)
            console.log("Values: ", values)
            return ethers.utils.defaultAbiCoder.encode(types, values);
        }


        if (!taskArgs.functionsmanager) {
            throw new Error("--functionsmanager must be specified");
        }

        const [functionsManagerOwner, user1, user2, user3] = await ethers.getSigners();

        const functionsManagerRaw = await ethers.getContractAt(
            "FunctionsManager",
            taskArgs.functionsmanager
        )


        // Read users into an object of [address]: SignerWithAddress
        const demoUsers = [user1, user2, user3].reduce((acc: { [key: string]: SignerWithAddress }, u) => {
            acc[u.address] = u
            return acc
        }, {})


        console.log("Demo users: ", Object.keys(demoUsers))
        const DEMO_OWNERS = process.env.DEMO_OWNERS?.split(",")
        console.log("Demo owners: ", DEMO_OWNERS)
        if (!DEMO_OWNERS || DEMO_OWNERS.length < demos.length) {
            console.log("Demo owners not specified")
            throw new Error("Please specify DEMO_OWNERS as a comma separated string of addresses. " +
                "This collection must have an equal length to the number of demos in demo-config.ts" +
                "Note, you can use the same account for multiple demos")
        }
        if (DEMO_OWNERS?.length < demos.length) {
            DEMO_OWNERS.forEach((owner) => {
                if (!demoUsers[owner]) {
                    console.log("Demo user not in PRIVATE_KEYS")
                    throw new Error(`Demo user ${owner} not in PRIVATE_KEYS`)
                }
            })
        }

        if (taskArgs.registerfunctions) {
            console.log("Registering functions...")
            for (let i = 0; i < demos.length; i++) {
                const demo = demos[i];
                const owner = demoUsers[DEMO_OWNERS[i]];
                const localFm = functionsManagerRaw.connect(owner);
                //     TODO check if function exists by calculating function id
                //     const functionExists = await localFm.getFunction(demo.functionId);
                try {
                    const registerCall = await localFm.registerFunction(demo.register)
                    const receipt = await registerCall.wait(1);
                } catch (e: any) {
                    console.log(e.message)
                }
                // TODO check for FunctionRegistered event
            }
        }

        // Execute each function
        for (let i = 0; i < demos.length; i++) {
            const demo = demos[i];
            const demoOwner = demoUsers[DEMO_OWNERS[i]]
            const functionId = getFunctionId(["string", "address"], [ethers.utils.toUtf8Bytes(await demo.register.functionName),
                ethers.utils.toUtf8Bytes(demoOwner.address)])
            const runs = Math.floor(Math.random() * taskArgs.numruns) + taskArgs.numrunsfloor
            for (let j = 0; j < runs; j++) {
                const callerIdx = Math.floor(Math.random() * 3);
                const caller = [user1, user2, user3][callerIdx]
                const functionManagerWithCaller = await functionsManagerRaw.connect(caller)
                const argsIdx = Math.floor(Math.random() * demo.execute.validArgs.length)
                const args = demo.execute.validArgs[argsIdx]
                const tx = await functionManagerWithCaller.executeRequest(functionId, args, demo.execute.gasLimit)
                const execReceipt = await tx.wait(1)
                console.log(`Finished run ${j}/${runs} for ${functionId}`)
                console.log(execReceipt.events)
            }
        }

        // TODO Check that the events have come through
    });
