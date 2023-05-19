// import {Functions} from "./functions-lib"; // DELETE THIS LINE IN SCRIPT
// const args: string[] = [] // DELETE THIS LINE IN SCRIPT

// *NAME*: CoinGecko Price
// *DESCRIPTION*: Fetches a price pair from coingecko
// *IMAGE_URL*: https://static.coingecko.com/s/coingecko-logo-8903d34ce19ca4be1c81f0db30e924154750d208683fad7ae6f2ce06c76d0a56.png
// *FEE*: 0.01
// *ARGS*: "base;string;See https://api.coingecko.com/api/v3/coins/list for a list of valid coin IDs","quote:string;See https://api.coingecko.com/api/v3/coins/list for a list of valid coin IDs"
// *CATEGORY*: Price Feed
// *SUBID*: NEW

const base = args[0]
const quote = args[1]

const response = await Functions.makeHttpRequest({
    url: `https://api.coingecko.com/api/v3/simple/price?ids=${base}&vs_currencies=${quote}`
});

const res = response.data[`${base}.${quote}`];

return Functions.encodeUint256(Math.round(res * 100))