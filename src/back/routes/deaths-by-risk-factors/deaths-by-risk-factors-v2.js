import express from 'express';
import { readFile } from '../../utils/readFile.js';
import store from '../../db/deaths-by-risk-factors.js';

import { validateTypes, validateYear, validateRiskFactors } from '../../utils/validators/validateInputs.js';

import { verifyToken } from '../../utils/auth/authMiddelware.js';

const router = express.Router();

const data = [];
const requiredFields = ['entity', 'year', 'high_systolic_blood_pressure', 'air_pollution', 'child_wasting',
   'household_air_pollution_from_solid_fuels', 'high_fasting_plasma_glucose'];

//store.insert(data);

const DOCUMENTATION_URL = "https://documenter.getpostman.com/view/52276011/2sBXijHrJv";

router.get('/deaths-by-risk-factors/docs', (req, res) => {
  res.redirect(DOCUMENTATION_URL);
});

// Loads the data from the file and stores it in memory for the route
router.get('/deaths-by-risk-factors/loadInitialData', (req, res) => {
  store.count({}, (err, count) => {
    if (count > 0) {
      return res.status(409).send("Conflict: Data already loaded");
    }
    let data = readFile('number-of-deaths-by-risk-factor.csv');
    let filteredData = data.map(item => ({
      entity: item.Entity,
      year: item.Year,
      high_systolic_blood_pressure: item['High systolic blood pressure'],
      air_pollution: item['Air pollution'],
      child_wasting: item['Child wasting'],
      household_air_pollution_from_solid_fuels: item['Household air pollution from solid fuels'],
      high_fasting_plasma_glucose: item['High fasting plasma glucose']
    }));
    store.insert(filteredData, (err, docs) => {
      docs.forEach(d => delete d._id);
      res.status(201).send("CREATED");
    });
  });
});

// Returns the data stored in memory for a specific country and year
router.get('/deaths-by-risk-factors', (req, res) => {
  const query = {}

  const offset = parseInt(req.query.offset) || null;
  const limit = parseInt(req.query.limit) || null;

  const country = req.query.country;
  const year = req.query.year;
  const high_systolic_blood_pressure = req.query.high_systolic_blood_pressure;
  const air_pollution = req.query.air_pollution;
  const child_wasting = req.query.child_wasting;
  const household_air_pollution_from_solid_fuels = req.query.household_air_pollution_from_solid_fuels;
  const high_fasting_plasma_glucose = req.query.high_fasting_plasma_glucose;
  const from = req.query.from;
  const to = req.query.to;

  if (year)
    query.year = parseInt(year);
  else if (from || to) {
    query.year = {};
    if (from)
      query.year.$gte = parseInt(from);
    if (to)
    query.year.$lte = parseInt(to);
  }
  if (country) query.entity = new RegExp(`^${country}$`, "i");
  if (high_systolic_blood_pressure) query.high_systolic_blood_pressure = { $gt: parseFloat(high_systolic_blood_pressure) };
  if (air_pollution) query.air_pollution = { $gt: parseFloat(air_pollution) };
  if (child_wasting) query.child_wasting = { $gt: parseFloat(child_wasting) };
  if (household_air_pollution_from_solid_fuels) query.household_air_pollution_from_solid_fuels = { $gt: parseFloat(household_air_pollution_from_solid_fuels) };
  if (high_fasting_plasma_glucose) query.high_fasting_plasma_glucose = { $gt: parseFloat(high_fasting_plasma_glucose) };

  store.find(query)
    .skip(offset)
    .limit(limit)
    .exec((err, data) => {
    if (data.length === 0)
      return res.status(404).send([]);
    data.forEach(d => delete d._id);
    if (data.length === 1)
      data = data[0];
    res.status(200).json(data);
  });
});

// Creates a new entry in the data stored in memory for the route
router.post('/deaths-by-risk-factors', verifyToken, (req, res) => {
  const newData = req.body;

  const isMissingFields = requiredFields.some(field => newData[field] === null || newData[field] === undefined || newData[field] === "");
  if (isMissingFields) {
    return res.status(400).send("Bad request: Missing required fields");
  }

  if( !validateTypes(newData.entity, newData.year)){
    return res.status(400).send("Bad request: Invalid data types");
  }

  if( !validateYear(newData.year)){
    return res.status(400).send("Bad request: Invalid year (year must be between 1900 and current year)");
  }

  if( !validateRiskFactors(newData)){
    return res.status(400).send("Bad request: Factors cannot be negative");
  }

  const hasExtraFields = Object.keys(newData).some(key => !requiredFields.includes(key));
  if (hasExtraFields) {
    return res.status(400).send("Bad request: Extra fields provided");
  }

  store.findOne(
    { entity: newData.entity, year: newData.year },
    (err, doc) => {
      if (doc)
        return res.status(409).send("Conflict: Data already exists");
      store.insert(newData, (err, inserted) => {
        delete inserted._id;
        res.status(201).send("CREATED");
      });
    }
  );
});

// Method not allowed for the route, since we don't want to update all the data at once
router.put('/deaths-by-risk-factors', (req, res) => {
  res.status(405).send('Method not allowed');
});

// Deletes all the data stored in memory for the route
router.delete('/deaths-by-risk-factors', (req, res) => {
  store.remove({}, { multi: true }, (err, numRemoved) => {
    res.status(204).send();
  });
});

// Returns the data stored in memory for a specific country and year
router.get('/deaths-by-risk-factors/:country/:year', (req, res) => {
  const country = req.params.country;
  const year = parseInt(req.params.year);
  store.find({ entity: new RegExp(`^${country}$`, "i"), year: year }, (err, data) => {
    if (data.length === 0)
      return res.status(404).send("Data not found");
    data.forEach(d => delete d._id);
    res.status(200).json(data[0]);
  });
});

// Method not allowed for the route, since we don't want to create a new country with a specific country
router.post('/deaths-by-risk-factors/:country', (req, res) => {
  res.status(405).send('Method not allowed');
});

// Updates the data stored in memory for a specific country
router.put('/deaths-by-risk-factors/:country/:year', (req, res) => {
  const country = req.params.country;
  const year = parseInt(req.params.year);
  const newData = req.body;

  const isMissingFields = requiredFields.some(field => newData[field] === null || newData[field] === undefined || newData[field] === "");
  if (isMissingFields) {
    return res.status(400).send("Bad request: Missing required fields");
  }

  if( !validateTypes(newData.entity, newData.year)){
    return res.status(400).send("Bad request: Invalid data types");
  }

  if( !validateYear(newData.year)){
    return res.status(400).send("Bad request: Invalid year (year must be between 1900 and current year)");
  }

  if( !validateRiskFactors(newData)){
    return res.status(400).send("Bad request: Factors cannot be negative");
  }if( !validateTypes(newData.entity, newData.year)){
    return res.status(400).send("Bad request: Invalid data types");
  }

  if( !validateYear(newData.year)){
    return res.status(400).send("Bad request: Invalid year (year must be between 1900 and current year)");
  }

  if( !validateRiskFactors(newData)){
    return res.status(400).send("Bad request: Factors cannot be negative");
  }

  const hasExtraFields = Object.keys(newData).some(key => !requiredFields.includes(key));
  if (hasExtraFields) {
    return res.status(400).send("Bad request: Extra fields provided");
  }
  
  if (newData.entity.toLowerCase() !== country.toLowerCase())
    return res.status(400).send("Country mismatch");
  if (newData.year !== year)
    return res.status(400).send("Year mismatch");
  store.update(
    { entity: new RegExp(`^${country}$`, "i"), year: year },
    newData,
    {},
    (err, numUpdated) => {
      if (numUpdated === 0)
        return res.status(404).send("Data not found");
      res.status(200).send();
    }
  );
});

// Deletes the data stored in memory for a specific country
router.delete('/deaths-by-risk-factors/:country/:year', (req, res) => {
  const country = req.params.country;
  const year = parseInt(req.params.year);
  store.remove({ entity: new RegExp(`^${country}$`, "i"), year: year }, {}, (err, numRemoved) => {
    if (numRemoved === 0)
      return res.status(404).send("Data not found");
    res.status(204).send();
  });
});

export default router;