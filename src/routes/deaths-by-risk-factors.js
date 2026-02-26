const express = require('express');
const router = express.Router();
const fileReader = require('../../utils/readFile.js');

const store = require('../data/store.js');

router.get('/deaths-by-risk-factors', (req, res) => {
  res.json(store.deathsByRiskFactors);
});

router.get('/deaths-by-risk-factors/loadInitialData', (req, res) => {
  if (store.deathsByRiskFactors.length === 0) {
    store.deathsByRiskFactors = fileReader.readFile('number-of-deaths-by-risk-factor.csv').slice(0, 10);
  }
  res.json(store.deathsByRiskFactors);
});

module.exports = router;