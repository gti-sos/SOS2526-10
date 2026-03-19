import express from 'express';
import deathsRoute from './src/routes/deaths-by-risk-factors.js';
import protestsRoute from './src/routes/protests.js';
import pandemicsRoute from './src/routes/pandemics.js';
import childMalnutritions from "./src/routes/child-malnutritions.js";


const app = express();

app.use(express.json());
app.use("/", express.static("./public"));

app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    if (req.get("Content-Type") && !req.is("application/json")) {
      return res.status(415).send("Only JSON allowed");
    }
  }
  next();
});

const BASE_API_URL = '/api/v1';
const PORT = process.env.PORT || 3000;

app.use(BASE_API_URL, deathsRoute);
app.use(BASE_API_URL, protestsRoute);
app.use(BASE_API_URL, pandemicsRoute);
app.use(BASE_API_URL, childMalnutritions);
app.use("/api/v2", childMalnutritions);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));