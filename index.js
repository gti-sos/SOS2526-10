const express = require('express');
const app = express();

// Load URLs from public folder
app.use(express.json());
app.use("/", express.static("./public"));

// Import routes and modules
const cool = require('./src/cool/cool.js');
const indexSMJ = require('./src/samples/index-SMJ.js');
const indexOMV = require('./src/samples/index-OMV.js');
const indexAGC = require('./src/samples/index-AGC.js');

// Define global constants
const BASE_API_URL = '/api/v1';
const PORT = process.env.PORT || 3000;

// Load the routes that return data
app.get(BASE_API_URL + '/cool', (req, res) => res.send(cool.coolFace()));
app.get(BASE_API_URL + '/samples/SMJ', (req, res) => res.send(indexSMJ.calculateAverage('afghanistan', 'unsafe_water_source')));
app.get(BASE_API_URL + '/samples/OMV', (req, res) => res.send(indexOMV.calculateAverage('canada', 'hdi_score')));
app.get(BASE_API_URL + '/samples/AGC', (req, res) => res.send(indexAGC.calculateAverageAGC('belgium', 'rabies')));

// Load the routes that showcase data
app.use(BASE_API_URL, require('./src/routes/deaths-by-risk-factors.js'));
app.use(BASE_API_URL, require('./src/routes/protests.js'));
app.use(BASE_API_URL, require('./src/routes/pandemics.js'));

// Route for the homepage
app.get('/', (req, res) => {
    res.send('Server running!');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));