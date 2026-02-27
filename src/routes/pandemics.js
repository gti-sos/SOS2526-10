const express = require('express');
const router = express.Router();
const fileReader = require('../../utils/readFile.js');

const store = require('../data/store.js');

// Loads the data from the file and stores it in memory for the route
router.get('/pandemics/loadInitialData', (req, res) => {
  if (store.pandemics.length === 0) {
    store.pandemics = fileReader.readFile('pandemics.csv').slice(0, 10);
  }
  res.status(200).json(store.pandemics);
});

// Returns the data stored in memory for the route
router.get('/pandemics', (req, res) => {
  res.status(200).json(store.pandemics);
});

// Creates a new entry in the data stored in memory for the route
router.post('/pandemics', (req, res) => {
  const newData = req.body;
  store.pandemics.push(newData);
  res.status(201).json(newData);
});

// Method not allowed for the route, since we don't want to update all the data at once
router.put('/pandemics', (req, res) => {
  res.status(405).send('Method not allowed');
});

// Deletes all the data stored in memory for the route
router.delete('/pandemics', (req, res) => {
  store.pandemics = [];
  res.status(204).send("All data deleted");
});

// Returns the data stored in memory for a specific country
router.get('/pandemics/:country', (req, res) => {
  const country = req.params.country;
  const data = store.pandemics.filter(item => item.Entity.toLowerCase() === country.toLowerCase());
    if (data.length > 0) {
        res.status(200).json(data);
    } else {
        res.status(404).send('Data not found for country: ' + country);
    }
});

// Method not allowed for the route, since we don't want to create a new country with a specific country
router.post('/pandemics/:country', (req, res) => {
    res.status(405).send('Method not allowed');
});

// Updates the data stored in memory for a specific country
router.put('/pandemics/:country', (req, res) => {
    const country = req.params.country.toLowerCase();
    
    const index = store.pandemics.findIndex(item => item.Entity.toLowerCase() === country);

    if (index === -1) {
        return res.status(404).send('Data not found for country: ' + country);
    }

    store.pandemics[index] = req.body;

    res.status(200).json(store.pandemics[index]);
});

// Deletes the data stored in memory for a specific country
router.delete('/pandemics/:country', (req, res) => {
    const country = req.params.country.toLowerCase();

    const index = store.pandemics.findIndex(item => item.Entity.toLowerCase() === country);

    if (index === -1) {
        return res.status(404).send('Data not found for country: ' + country);
    }
    
    store.pandemics.splice(index, 1);
    res.status(204).end();
});

module.exports = router;