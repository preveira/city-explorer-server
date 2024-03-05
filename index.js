'use strict'; //strict error handling, forces to use valid keywords

const express = require('express'); //required is a build in node function for loading dependencies
const cors = require('cors');

//invoke express to create our "app"
const app = express();

//define out endpoints '/' insert endpoint here
app.get('/weather', (request, response) => {
    console.log('Endpoint hit!'); //terminal should log this
    response.send('Hello from Express') //client should receive this
});

//method for starting server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});