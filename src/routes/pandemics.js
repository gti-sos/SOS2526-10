const express = require('express');
const router = express.Router();
const fileReader = require('../../utils/readFile.js');

let data = [];

router.get('/pandemics', (req, res) => {
  res.json(data);
});

router.get('/pandemics/loadInitialData', (req, res) => {
  if (data.length === 0) {
    data = fileReader.readFile('pandemics.csv').slice(0, 10);
  }
  res.json(data);
});

module.exports = router;