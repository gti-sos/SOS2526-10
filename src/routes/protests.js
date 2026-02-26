const express = require('express');
const router = express.Router();
const fileReader = require('../../data/readFile.js');

let data = [];

router.get('/protests', (req, res) => {
  res.json(data);
});

router.get('/protests/loadInitialData', (req, res) => {
  if (data.length === 0) {
    data = fileReader.readFile('number-of-deaths-by-risk-factor.csv').slice(0, 10);
  }
  res.json(data);
});

module.exports = router;