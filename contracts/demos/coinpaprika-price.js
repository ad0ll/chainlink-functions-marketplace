// This example shows how to make call an API using a secret
// https://coinmarketcap.com/api/documentation/v1/

// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
const coinPaprikaCoinId = args[0];
const currencyCode = args[1];

// build HTTP request object
const coinPaprikaRequest = Functions.makeHttpRequest({
  url: `https://api.coinpaprika.com/v1/tickers/${coinPaprikaCoinId}?quotes=${currencyCode}`,
});

// Make the HTTP request
const coinPaprikaResponse = await coinPaprikaRequest;

if (coinPaprikaResponse.error) {
  throw new Error("Coinpaprika Error");
}

// fetch the price
const price = coinPaprikaResponse.data.quotes[currencyCode].price;

console.log(`Price: ${price.toFixed(2)} ${currencyCode}`);

// price * 100 to move by 2 decimals (Solidity doesn't support decimals)
// Math.round() to round to the nearest integer
// Functions.encodeUint256() helper function to encode the result from uint256 to bytes
return Functions.encodeUint256(Math.round(price * 100));
