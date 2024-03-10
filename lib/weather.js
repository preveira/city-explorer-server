//weather.js
'use strict';

const axios = require('axios');
let cache = require('./cache.js'); // Import cache module

//server side we read environment
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_URL = process.env.WEATHER_URL;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

const parseWeather = (weatherData) => {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Forecast(day.datetime, day.weather.description);
    });
    return weatherSummaries;
  } catch (e) {
    console.error('Error parsing weather data:', e);
    throw e; // Propagate the error
  }
};

// Replace the existing getWeather function with the updated version
const getWeather = async (lat, lon) => {
  const key = 'weather-' + lat + lon; // Cache key
  const url = `${WEATHER_URL}?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
    return Promise.resolve(cache[key].data); // Return cached data
  } else {
    console.log('Cache miss');
    let weatherResponse = await axios.get(url)
      .then(response => {
        const weatherData = parseWeather(response.data); // Parse weather data
        cache[key] = {
          timestamp: Date.now(),
          data: weatherData
        }; // Cache fresh data
        return weatherData; // Return fresh data
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        throw error; // Propagate the error
      });

    return weatherResponse;
  }
}; 

const parseLatLon = (params) => {
  let [item1, item2] = params.lat_lon.split('_');
  return [Number(parseFloat(item1).toFixed(4)), Number(parseFloat(item2).toFixed(4))];
};

const handleWeatherRequest = async (request, response) => {
  let [lat, lon] = parseLatLon(request.params);
  // Find the city based on lat, lon, or searchQuery
  try {
    const weatherData = await getWeather(lat, lon);
    response.send(weatherData);
  } catch (error) {
    console.error('Error handling weather request:', error);
    response.status(500).send('Internal Server Error');
  }
};

module.exports = {
  parseLatLon,
  Forecast,
  getWeather,
  handleWeatherRequest
};
