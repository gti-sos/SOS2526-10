import express from 'express';
const router = express.Router();
import { readFile } from '../../utils/readFile.js';
import DataStore from "nedb";

const DOCUMENTATION_URL = "https://documenter.getpostman.com/view/52275979/2sBXinFVKK";
router.get('/protests/docs', (req, res) => {
  res.redirect(DOCUMENTATION_URL);
});

// Required fields for creating or updating a protest entry
const requiredFields = [
  "id", "country", "year", "region", "protest", "protesterviolence",
  "protesterdemand", "stateresponse", "electoral_ecore", "liberal_score",
  "participatory_score", "deliberative_score", "egalitarian_score",
  "hdi_score", "violence_status", "predicted_prob"
];

let db = new DataStore();

// Helper function to handle errors
let handleServerError = (err, res) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
}


let removeIdField = (data) => {
  return data.map(({ _id, ...rest }) => rest);
}


/*
==============================================================

METHODS FOR COLLECTIONS

==============================================================
*/

// Loads the data from the file and stores it in memory for the route
router.get('/protests/loadInitialData', (req, res) => {
  db.find({}, (err, data) => {
    if (err) return handleServerError(err, res);
    // If theres no data load it
    if (data.length === 0) {
      let newData = readFile('protests.csv')

      // Insert the new data
      db.insert(newData, (err, newDocs) => {
        if (err) return handleServerError(err, res);
        res.status(200).json('Data loaded successfully');
      });
    }

    // if there is data return 200 OK
    else {
      res.status(200).json('Data already loaded');
    }
  });
});


// Creates a new entry in the data stored in memory for the route
router.post('/protests', (req, res) => {
  const newData = req.body;

  // Verify that all required fields are present
  const missingFields = requiredFields.filter(field => !(field in newData));

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Faltan campos obligatorios",
      missing: missingFields
    });
  }


  // Verify that there are no extra fields
  if (Object.keys(newData).length !== requiredFields.length) {
    return res.status(400).json({
      error: "Missing or extra fields in request body",
      expected: requiredFields,
      received: Object.keys(newData)
    });
  }


  // Verify that the ID is unique
  db.findOne({ id: newData.id }, (err, doc) => {
    if (err) return handleServerError(err, res);
    if (doc) {
      return res.status(409).json({
        error: "ID already exists"
      });
    }

    // Add if no errors
    db.insert(newData, (err, _) => {
      if (err) return handleServerError(err, res);
      res.status(201).json(newData);
    });
  });

});


// Method not allowed for the route, since we don't want to update all the data at once
router.put('/protests', (req, res) => {
  res.status(405).send('Method not allowed');
});

// Deletes all the data stored in memory for the route
router.delete('/protests', (req, res) => {
  db.remove({}, { multi: true }, (err, _) => {
    if (err) return handleServerError(err, res);
    res.status(204).send();
  });
});


/*
==============================================================

METHODS FOR RESOURCES

==============================================================
*/

// Returns the data stored in memory for a specific protest
router.get('/protests/:id', (req, res) => {
  const id = Number(req.params.id);

  // Validate that the ID is a number
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID must be a number' });
  }

  // Find the protest with the specified ID and return it
  db.findOne({ id: id }, (err, data) => {
    if (err) return handleServerError(err, res);

    // If the protest exists, return it; otherwise, return a 404 error
    if (data) {
      const mappedData = removeIdField([data])[0];
      res.status(200).json(mappedData);
    } else {
      res.status(404).send({ error: 'Data not found for protest ID: ' + id });
    }
  });
});


// Get a protest by params
router.get('/protests', (req, res) => {
 const query = {}

  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 0;

  const country = req.query.country;
  const year = req.query.year;
  const region = req.query.region;
  const protest = req.query.protest;
  const protesterviolence = req.query.protesterviolence;
  const electoral_ecore = req.query.electoral_ecore;
  const liberal_score = req.query.liberal_score;
  const participatory_score = req.query.participatory_score;
  const deliberative_score = req.query.deliberative_score;
  const egalitarian_score = req.query.egalitarian_score;
  const hdi_score = req.query.hdi_score;
  const violence_status = req.query.violence_status;
  const predicted_prob = req.query.predicted_prob;
  const from = req.query.from;
  const to = req.query.to;

  if (country) query.country = new RegExp(country, "i");
  if (year) query.year = parseInt(year);
  if (region) query.region = new RegExp(region, "i");
  if (protest) query.protest = { $gte: parseInt(protest) };
  if (protesterviolence) query.protesterviolence = { $gte: parseInt(protesterviolence) };
  if (electoral_ecore) query.electoral_ecore = { $gte: parseFloat(electoral_ecore) };
  if (liberal_score) query.liberal_score = { $gte: parseFloat(liberal_score) };
  if (participatory_score) query.participatory_score = { $gte: parseFloat(participatory_score) };
  if (deliberative_score) query.deliberative_score = { $gte: parseFloat(deliberative_score) };
  if (egalitarian_score) query.egalitarian_score = { $gte: parseFloat(egalitarian_score) };
  if (hdi_score) query.hdi_score = { $gte: parseFloat(hdi_score) };
  if (violence_status) query.violence_status = { $gte: parseInt(violence_status) };
  if (predicted_prob) query.predicted_prob = { $gte: parseFloat(predicted_prob) };

  if (from || to) {
    query.year = {};
    if (from) query.year.$gte = parseInt(from);
    if (to) query.year.$lte = parseInt(to);
  }

  db.find(query)
    .skip(offset)
    .limit(limit)
    .exec((err, data) => {
    if (err) return handleServerError(err, res);
    if (data.length === 0)
      return res.status(404).send("Data not found");
    data.forEach(d => delete d._id);
    if (data.length === 1)
      data = data[0];
    res.status(200).json(data);
  });
});

// Method not allowed for the route
router.post('/protests/:countryID', (req, res) => {
  res.status(405).send('Method not allowed');
});

// Updates the data stored in memory for a specific country
router.put('/protests/:protestID', (req, res) => {
  const protestID = Number(req.params.protestID);

  // Check NaN
  if (isNaN(protestID)) {
    return res.status(400).json({ error: 'ID must be a number' });
  }

  // Body ID must match URL ID
  if (req.body.id !== protestID) {
    return res.status(400).send('ID in body must match ID in URL');
  }

  // Verify fields
  const missingFields = requiredFields.filter(field => !(field in req.body));

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required fields in request body",
      missing: missingFields
    });
  }

  if (Object.keys(req.body).length !== requiredFields.length) {
    return res.status(400).json({
      error: "Missing or extra fields in request body",
      expected: requiredFields,
      received: Object.keys(req.body)
    });
  }

  db.update({ id: protestID }, req.body, {}, (err, numReplaced) => {
    if (err) return handleServerError(err, res);
    if (numReplaced === 0) {
      return res.status(404).json({ error: 'Data not found for protest ID: ' + protestID });
    }

    res.status(200).json(req.body);
  });
});

// Deletes the data stored in memory for a specific country
router.delete('/protests/:protestID', (req, res) => {
  const protestID = Number(req.params.protestID);
  // Check NaN
  if (isNaN(protestID)) {
    return res.status(400).json({ error: 'ID must be a number' });
  }

  // Remove the protest with the specified ID
  db.remove({ id: protestID }, (err, numRemoved) => {
    if (err) return handleServerError(err, res);
    if (numRemoved === 0) {
      return res.status(404).json({ error: 'Data not found for protest ID: ' + protestID });
    }
    else {
      res.status(204).send();
    }

  });
})

export default router;