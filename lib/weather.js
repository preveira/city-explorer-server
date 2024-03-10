'use strict';

const axios = require('axios');
let cache = require('./cache.js'); 


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
    throw e; 
  }
};

const getWeather = async (lat, lon) => {
  const key = 'weather-' + lat + lon; 
  const url = `${WEATHER_URL}?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
    return Promise.resolve(cache[key].data); 
  } else {
    console.log('Cache miss');
    let weatherResponse = await axios.get(url)
      .then(response => {
        const weatherData = parseWeather(response.data); 
        cache[key] = {
          timestamp: Date.now(),
          data: weatherData
        }; 
        return weatherData; 
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        throw error; 
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
