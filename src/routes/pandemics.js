const express = require('express');
const router = express.Router();
const fileReader = require('../../utils/readFile.js');

const store = require('../data/store.js');

// Returns the data stored in memory for the route
router.get('/pandemics', (req, res) => {
  res.json(store.pandemics);
});

// Loads the data from the file and stores it in memory for the route
router.get('/pandemics/loadInitialData', (req, res) => {
  if (store.pandemics.length === 0) {
    store.pandemics = fileReader.readFile('pandemics.csv').slice(0, 10);
  }
  res.json(store.pandemics);
});

module.exports = router;