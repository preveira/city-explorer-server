'use strict';

const axios = require('axios');

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const MOVIES_URL = process.env.MOVIES_URL;

const getMovies = async (city) => {
  const options = {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${MOVIE_API_KEY}`
    }
  };
  let movieResponse = await axios.get(`${MOVIES_URL}?query=${city}`, options);
  console.log('WHY DIS BROKEN');
  return movieResponse.data;

};

const handleMovieRequest = async (request, response) => {
  const moviesData = await getMovies(request.params.city);
  console.log(moviesData);
  response.send(moviesData);
};

// export things to other files
module.exports = {
  getMovies,
  handleMovieRequest,
};
