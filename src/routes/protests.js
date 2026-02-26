const express = require('express');
const router = express.Router();
const fileReader = require('../../utils/readFile.js');

const store = require('../data/store.js');

router.get('/protests', (req, res) => {
  res.json(store.protests);
});

router.get('/protests/loadInitialData', (req, res) => {
  if (store.protests.length === 0) {
    store.protests = fileReader.readFile('protests.csv').slice(0, 10);
  }
  res.json(store.protests);
});

module.exports = router;