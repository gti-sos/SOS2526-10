import express from "express";
import Datastore from "nedb-promises";

const router = express.Router();

// database NeDB
const db = Datastore.create("child-malnutritions.db");

/* LOAD INITIAL DATA */
router.get("/child-malnutritions/loadInitialData", async (req, res) => {

    const count = await db.count({});

    if(count > 0){
        return res.status(200).json({message:"Data already loaded"});
    }

    const initialData = [
        { country:"Spain", year:2020, region:"Europe", stunting_rate:5.2 },
        { country:"France", year:2020, region:"Europe", stunting_rate:4.1 },
        { country:"Italy", year:2020, region:"Europe", stunting_rate:5.0 },
        { country:"Germany", year:2020, region:"Europe", stunting_rate:3.8 },
        { country:"India", year:2020, region:"Asia", stunting_rate:34.7 },
        { country:"China", year:2020, region:"Asia", stunting_rate:8.1 },
        { country:"Brazil", year:2020, region:"America", stunting_rate:6.5 },
        { country:"USA", year:2020, region:"America", stunting_rate:2.3 },
        { country:"Nigeria", year:2020, region:"Africa", stunting_rate:36.8 },
        { country:"Kenya", year:2020, region:"Africa", stunting_rate:26.0 }
    ];

    await db.insert(initialData);

    res.status(201).json({message:"Initial data loaded"});
});


/* GET COLLECTION */
router.get("/child-malnutritions", async (req, res) => {

    const query = {};

    if(req.query.country) query.country = req.query.country;
    if(req.query.year) query.year = parseInt(req.query.year);
    if(req.query.region) query.region = req.query.region;
    if(req.query.stunting_rate) query.stunting_rate = parseFloat(req.query.stunting_rate);

    const limit = parseInt(req.query.limit) || 0;
    const offset = parseInt(req.query.offset) || 0;

    let data = await db.find(query).skip(offset).limit(limit);

    data.forEach(d => delete d._id);

    res.status(200).json(data);
});


/* GET SINGLE */
router.get("/child-malnutritions/:country/:year", async (req, res) => {

    const country = req.params.country;
    const year = parseInt(req.params.year);

    const data = await db.findOne({ country, year });

    if(!data){
        return res.status(404).json({error:"Not found"});
    }

    delete data._id;

    res.status(200).json(data);
});


/* POST */
router.post("/child-malnutritions", async (req, res) => {

    const newData = req.body;

    if(!newData.country || !newData.year || !newData.region || newData.stunting_rate === undefined){
        return res.status(400).json({error:"Bad request: missing fields"});
    }

    const exists = await db.findOne({
        country: newData.country,
        year: newData.year
    });

    if(exists){
        return res.status(409).json({error:"Resource already exists"});
    }

    await db.insert(newData);

    res.status(201).json(newData);
});


/* PUT */
router.put("/child-malnutritions/:country/:year", async (req, res) => {

    const country = req.params.country;
    const year = parseInt(req.params.year);
    const updatedData = req.body;

    if(updatedData.country !== country || updatedData.year !== year){
        return res.status(400).json({error:"URL and body do not match"});
    }

    const result = await db.update(
        { country, year },
        updatedData
    );

    if(result === 0){
        return res.status(404).json({error:"Not found"});
    }

    res.sendStatus(200);
});


/* DELETE ALL */
router.delete("/child-malnutritions", async (req, res) => {

    await db.remove({}, { multi: true });

    res.sendStatus(200);
});


/* DELETE ONE */
router.delete("/child-malnutritions/:country/:year", async (req, res) => {

    const country = req.params.country;
    const year = parseInt(req.params.year);

    const deleted = await db.remove({ country, year });

    if(deleted === 0){
        return res.status(404).json({error:"Not found"});
    }

    res.sendStatus(200);
});


/* METHOD NOT ALLOWED (IMPORTANTE 👇) */
router.all("/child-malnutritions/:country/:year", (req, res) => {
    res.sendStatus(405);
});

router.all("/child-malnutritions", (req, res) => {
    res.sendStatus(405);
});

export default router;