// import fs from "fs";
// import {FunctionsManager} from "../typechain-types";
// import {formatBytes32String} from "ethers/lib/utils";
//
// const imageUrls = {
//     maxHeadroom: "https://i.imgur.com/VE7uGB9.gif",
//     //TODO Swap below with the official version (Google Drive link: https://drive.google.com/drive/folders/1owvdEhRDtmwxE-7cAdxBXhjswiDPDT9W) uploaded on the vercel app since we can't get a direct link from google drive..
//     coingecko: "https://i.pinimg.com/736x/be/c9/b3/bec9b33d6638ff927a96d0e93546a056.jpg",
//     calculateApy: "https://upload.wikimedia.org/wikipedia/commons/1/18/Simple_calculator.svg",
//     ethLogo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg"
//
// }
//
// const extractSourceFromDemo = (demoPath: string) => {
//     const content = fs.readFileSync(demoPath, "utf-8").toString()
//     let start = -1
//     let end = -1
//     content.split("\n").forEach((line, i) => {
//         if (line.match(".*BEGIN[ _]SRC.*")) {
//             start = i
//         } else if (line.match(".*END[ _]SRC.*")) {
//             end = i
//         }
//     })
//     if (start === -1 || end === -1) {
//         throw new Error("Could not find start or end of snippet")
//     }
//     return content.split("\n").slice(start, end).join("\n")
// }
//
// type DemoConfig = {
//     file: string,
//     register: FunctionsManager.FunctionsRegisterRequestStruct,
//     execute: {
//         validArgs: string[][],
//         gasLimit: number
//     }
// }
// const demos: DemoConfig[] = [{
//     file: "./demos/coingecko-price.ts",
//     register: {
//         fees: BigInt(10 ** 18 ** 0.05),
//         functionName: "CoinGecko Price",
//         desc: "Fetches a given price pair from CoinGecko",
//         imageUrl: imageUrls.coingecko,
//         expectedArgs: [
//             "base;string;See the following for all possible values: https://api.coingecko.com/api/v3/coins/list",
//             "quote;string;See the following for all possible values: https://api.coingecko.com/api/v3/coins/list"],
//         codeLocation: 0,
//         secretsLocation: 0,
//         language: 0,
//         category: formatBytes32String("Price Feed"),
//         subId: 0, //TODO fix this, it'll break when you run in prod
//         source: extractSourceFromDemo("./demos/coingecko-price.ts"),
//         secrets: []
//     },
//     execute: {
//         validArgs: [
//             ["ethereum", "usd"],
//             ["bitcoin", "usd"],
//             ["ripple", "jpy"],
//             ["ethereum", "eur"],
//         ],
//         gasLimit: 500_000
//     },
// }]
//
// export default demos