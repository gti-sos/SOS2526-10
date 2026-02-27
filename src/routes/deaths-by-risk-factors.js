const express = require('express');
const router = express.Router();
const fileReader = require('../../utils/readFile.js');

const store = require('../data/store.js');

// Loads the data from the file and stores it in memory for the route
router.get('/deaths-by-risk-factors/loadInitialData', (req, res) => {
  if (store.deathsByRiskFactors.length === 0) {
    store.deathsByRiskFactors = fileReader.readFile('number-of-deaths-by-risk-factor.csv').slice(0, 10);
  }
  res.status(200).json(store.deathsByRiskFactors);
});

// Returns the data stored in memory for the route
router.get('/deaths-by-risk-factors', (req, res) => {
  res.status(200).json(store.deathsByRiskFactors);
});

// Creates a new entry in the data stored in memory for the route
router.post('/deaths-by-risk-factors', (req, res) => {
  const newData = req.body;
  store.deathsByRiskFactors.push(newData);
  res.status(201).json(newData);
});

// Method not allowed for the route, since we don't want to update all the data at once
router.put('/deaths-by-risk-factors', (req, res) => {
  res.status(405).send('Method not allowed');
});

// Deletes all the data stored in memory for the route
router.delete('/deaths-by-risk-factors', (req, res) => {
  store.deathsByRiskFactors = [];
  res.status(204).send("All data deleted");
});

// Returns the data stored in memory for a specific country
router.get('/deaths-by-risk-factors/:country', (req, res) => {
  const country = req.params.country;
  const data = store.deathsByRiskFactors.filter(item => item.Entity.toLowerCase() === country.toLowerCase());
    if (data.length > 0) {
        res.status(200).json(data);
    } else {
        res.status(404).send('Data not found for country: ' + country);
    }
});

// Method not allowed for the route, since we don't want to create a new country with a specific country
router.post('/deaths-by-risk-factors/:country', (req, res) => {
    res.status(405).send('Method not allowed');
});

// Updates the data stored in memory for a specific country
router.put('/deaths-by-risk-factors/:country', (req, res) => {
    const country = req.params.country.toLowerCase();
    
    const index = store.deathsByRiskFactors.findIndex(item => item.Entity.toLowerCase() === country);

    if (index === -1) {
        return res.status(404).send('Data not found for country: ' + country);
    }

    store.deathsByRiskFactors[index] = req.body;

    res.status(200).json(store.deathsByRiskFactors[index]);
});

// Deletes the data stored in memory for a specific country
router.delete('/deaths-by-risk-factors/:country', (req, res) => {
    const country = req.params.country.toLowerCase();

    const index = store.deathsByRiskFactors.findIndex(item => item.Entity.toLowerCase() === country);

    if (index === -1) {
        return res.status(404).send('Data not found for country: ' + country);
    }
    
    store.deathsByRiskFactors.splice(index, 1);
    res.status(204).end();
});

module.exports = router;