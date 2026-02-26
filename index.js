let express = require('express');

let app=express();

app.use("/", express.static("./public"));

const cool = require('./cool/cool.js');
const indexSMJ = require('./samples/index-SMJ.js');
const indexMRJ = require('./samples/index-MRJ.js');
const fileReader = require('./data/readFile.js');
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/cool', (req, res) => {
  res.send(cool.coolFace());
});

app.get('/samples/SMJ', (req, res) => {
  res.send(indexSMJ.calculateAverageSMJ('afghanistan', 'unsafe_water_source'));
})

app.get('/samples/MRJ', (req, res) => {
  res.send(indexMRJ.calculateAverage('canada', 'hdi_score'));
})

let deathByRiskFactor = [];
let protests = [];

// =============================== Factores de riesgo ===============================
app.get('/deaths-by-risk-factors', (req, res) => {
  res.json(deathByRiskFactor);
});

app.get('/deaths-by-risk-factors/loadInitialData', (req, res) => {
  if (deathByRiskFactor.length === 0) {
    deathByRiskFactor = fileReader.readFile('number-of-deaths-by-risk-factor.csv')
      .slice(0, 10);
  }
  res.json(deathByRiskFactor);
});
// =============================== Factores de riesgo ===============================


// =============================== Protestas ===============================
app.get('/protests', (req, res) => {
  res.json(protests);
});

app.get('/protests/loadInitialData', (req, res) => {
  if (protests.length === 0) {
    protests = fileReader.readFile('protests.csv')
      .slice(0, 10);
  }
  res.json(protests);
});
// =============================== Protestas ===============================


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
