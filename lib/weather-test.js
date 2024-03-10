// weather_test.js

// Import the function to be tested from your weather module
const { handleWeatherRequest } = require('./lib/weather.js');

// Create a request object for testing
const request = {
  params: {
    lat_lon: '37.7749_-122.4194' // Example location (San Francisco)
  }
};

// Create a mock response object for testing
const response = {
  send: function(data) {
    console.log('RECEIVED WEATHER DATA:', data);
  }
};

// Call the function to be tested with the mock request and response
handleWeatherRequest(request, response);

// Call the function again to check cache behavior
handleWeatherRequest(request, response);
