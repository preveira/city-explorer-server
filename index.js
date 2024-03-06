'use strict';

const express = require('express');
const cors = require('cors');
const weatherData = require('./weather.json');
const app = express();
const dotenv = require('dotenv');


dotenv.config(); //loads our environment variables from our .env file

const PORT = process.env.PORT || 3000;
//server side we read environment variables using the process.emv object

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.use(cors());
app.use(express.json());



app.get('/weather/:lat_lon', (request, response) => {
  const lat = request.params.lat_lon.split('_')[0];
  const lon = request.params.lat_lon.split('_')[1];
  console.log(lat, lon);
  // Find the city based on lat, lon, or searchQuery
  console.log(weatherData);
  let weatherDex = weatherData.find(city => city.lat === lat && city.lon === lon);


  // If city not found, return an error
  if (!weatherDex) {
    return response.status(404).json({ error: 'City not found' });
  }

  // Process weather data for the city
  const forecasts = weatherDex.data.map(day => new Forecast(day.datetime, day.weather.description));

  // Send the processed data back to the client
  response.send(forecasts);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
