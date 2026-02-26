const express = require('express');
const router = express.Router();
const fileReader = require('../../utils/readFile.js');

const store = require('../data/store.js');

// Returns the data stored in memory for the route
router.get('/protests', (req, res) => {
  res.json(store.protests);
});

// Loads the data from the file and stores it in memory for the route
router.get('/protests/loadInitialData', (req, res) => {
  if (store.protests.length === 0) {
    store.protests = fileReader.readFile('protests.csv').slice(0, 10);
  }
  res.json(store.protests);
});

module.exports = router;