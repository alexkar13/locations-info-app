exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);
  const url = `${NINJA_API_BASE_PATH}/geocoding?city=${body.searchTerm}`;
  
  const response = await fetch(url, headers);
  const json = await response.json();
  
  return {
    statusCode: 200,
    body: JSON.stringify({ data: json }),
  };
};

const NINJA_API_BASE_PATH = "https://api.api-ninjas.com/v1";
const apiKey = process.env.API_KEY;
const headers = {
  headers: {
    "X-Api-Key": apiKey,
    "Content-Type": "application/json",
  },
};
