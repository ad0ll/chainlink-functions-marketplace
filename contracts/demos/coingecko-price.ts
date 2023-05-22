import { Functions } from "./functions-lib"; // DELETE THIS LINE IN SCRIPT

export const coinGeckoPrice = async (args: string) => {
  // ***BEGIN SRC***
  const base = args[0];
  const quote = args[1];

  const response = await Functions.makeHttpRequest({
    url: `https://api.coingecko.com/api/v3/simple/price?ids=${base}&vs_currencies=${quote}`,
  });

  const res = response.data[`${base}.${quote}`];

  return Functions.encodeUint256(Math.round(res * 100));
  // ***END SRC***
};
