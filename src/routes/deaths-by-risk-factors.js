const express = require('express');
const router = express.Router();
const fileReader = require('../../utils/readFile.js');

let data = [];

router.get('/deaths-by-risk-factors', (req, res) => {
  res.json(data);
});

router.get('/deaths-by-risk-factors/loadInitialData', (req, res) => {
  if (data.length === 0) {
    data = fileReader.readFile('number-of-deaths-by-risk-factor.csv').slice(0, 10);
  }
  res.json(data);
});

module.exports = router;