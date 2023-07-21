/**
 * Netlify serverless function that fetches the time and temp of particular location.
 * The serverless function serves the purpose of not revealing the API key.
 * @param {} event
 * @param {*} context
 * @returns
 */
exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);
  const weatherAPI = `https://api.api-ninjas.com/v1/weather?lat=${body.lat}&lon=${body.long}`;
  const timeAPI = `https://api.api-ninjas.com/v1/worldtime?lat=${body.lat}&lon=${body.long}`;

  const apiKey = process.env.API_KEY;
  const headers = {
    headers: {
      "X-Api-Key": apiKey,
      "Content-type": "application/json",
    },
  };

  const results = await Promise.allSettled([
    fetchInfo(weatherAPI, headers),
    fetchInfo(timeAPI, headers),
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify({ data: results }),
  };
};

async function fetchInfo(url, headers) {
  const response = await fetch(url, headers);
  const data = await response.json();

  return data;
}
