const express = require('express');
const router = express.Router();
const fileReader = require('../../utils/readFile.js');

const store = require('../data/store.js');

// Returns the data stored in memory for the route
router.get('/deaths-by-risk-factors', (req, res) => {
  res.json(store.deathsByRiskFactors);
});

// Loads the data from the file and stores it in memory for the route
router.get('/deaths-by-risk-factors/loadInitialData', (req, res) => {
  if (store.deathsByRiskFactors.length === 0) {
    store.deathsByRiskFactors = fileReader.readFile('number-of-deaths-by-risk-factor.csv').slice(0, 10);
  }
  res.json(store.deathsByRiskFactors);
});

module.exports = router;