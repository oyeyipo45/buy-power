
const axios = require('axios').default;

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};


/* POST Find Cities */
module.exports.findCities = async function (event, context) {
  // This will prevent aws from closing the database connection pool
  context.callbackWaitsForEmptyEventLoop = false;

  // Get keyword
  const { keyword } = JSON.parse(event.body);

  // Capitalze keyword to get effective search
  const capitalizedKeyword = capitalizeFirstLetter(keyword);

  try {
    // Request parameters
    const options = {
      method: 'GET',
      url: 'https://spott.p.rapidapi.com/places',
      params: { q: capitalizedKeyword, limit: '100', type: 'CITY' },
      headers: {
        'x-rapidapi-key': '3aafaac323mshf2db844f4963925p12e224jsn1cee2c164576',
        'x-rapidapi-host': 'spott.p.rapidapi.com',
      },
    };

    // Request for all cities details
    const result = await axios.request(options);

    // Map city names alone without other details
    const cities = result.data.map((city) => city.name);

    // Set the response
    response = common.responseBuilder(200, cities);
    return response;
  } catch (error) {
    console.log(error);
    response = common.responseBuilder(400, error);
    return response;
  }
};
