const latitude = args[0];
const longitude = args[1];

const pointsRequest = Functions.makeHttpRequest({
  url: `https://api.weather.gov/points/${latitude},${longitude}`,
});

const pointsResponse = await pointsRequest;

const forecastUrl = pointsResponse.data.properties.forecast;

const forecastRequest = Functions.makeHttpRequest({
  url: forecastUrl,
});

const forecastResponse = await forecastRequest;

const shortForecast = forecastResponse.data.properties.periods[0].shortForecast;

return Functions.encodeString(shortForecast);
