const express = require('express');
const router = express.Router();
const fileReader = require('../../utils/readFile.js');

const store = require('../data/store.js');

router.get('/pandemics', (req, res) => {
  res.json(store.pandemics);
});

router.get('/pandemics/loadInitialData', (req, res) => {
  if (store.pandemics.length === 0) {
    store.pandemics = fileReader.readFile('pandemics.csv').slice(0, 10);
  }
  res.json(store.pandemics);
});

module.exports = router;