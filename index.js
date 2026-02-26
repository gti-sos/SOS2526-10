const express = require('express');
const app = express();

app.use(express.json());
app.use("/", express.static("./public"));

const cool = require('./cool/cool.js');
const indexSMJ = require('./samples/index-SMJ.js');
const indexOMV = require('./samples/index-OMV.js');
const indexAGC = require('./samples/index-AGC.js');

const BASE_API_URL = '/api/v1';
const PORT = process.env.PORT || 3000;

// Samples
app.get(BASE_API_URL + '/cool', (req, res) => res.send(cool.coolFace()));
app.get(BASE_API_URL + '/samples/SMJ', (req, res) => res.send(indexSMJ.calculateAverage('afghanistan', 'unsafe_water_source')));
app.get(BASE_API_URL + '/samples/OMV', (req, res) => res.send(indexOMV.calculateAverage('canada', 'hdi_score')));
app.get(BASE_API_URL + '/samples/AGC', (req, res) => res.send(indexAGC.calculateAverageAGC('belgium', 'rabies')));

// Rutas de datos
app.use(BASE_API_URL, require('./src/routes/deaths-by-risk-factors.js'));
app.use(BASE_API_URL, require('./src/routes/protests.js'));
app.use(BASE_API_URL, require('./src/routes/pandemics.js'));

//Main page
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));