import express from 'express';
import cors from "cors"; 
import deathsRoute from './src/back/routes/deaths-by-risk-factors/deaths-by-risk-factors.js';
import deathsRouteV2 from './src/back/routes/deaths-by-risk-factors/deaths-by-risk-factors-v2.js';
import protestsRoute from './src/back/routes/protests/protests.js';
import protestsRouteV2 from './src/back/routes/protests/protests-v2.js';
import pandemicsRoute from './src/back/routes/pandemics/pandemics.js';
import pandemicsRouteV2 from './src/back/routes/pandemics/pandemics-v2.js'
import childMalnutritions from "./src/back/routes/child-malnutritions/child-malnutritions.js";

import authRoutes from './src/back/utils/auth/index.js';

import { handler as svelteHandler } from './src/front/build/handler.js';
import { verifyToken } from './src/back/utils/auth/authMiddelware.js';

const BASE_API_URL = '/api/v1';
const V2_API_URL = '/api/v2';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());       
app.use(express.json());

app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    if (req.get("Content-Type") && !req.is("application/json")) {
      return res.status(415).send("Unsupported Media Type: Only JSON allowed");
    }
  }
  next();
});

/*
app.use((req, res, next) => {
  const protectedMethods = ["POST", "PUT", "DELETE"];
  if (protectedMethods.includes(req.method)){
    if (req.path.includes('/login') || req.path.includes('/register'))
      return next();
    
    return verifyToken(req, res, next);
  }
  next();
});
*/

app.set('secretKey', 'tu_clave_secreta_aqui');

app.use(BASE_API_URL, authRoutes);
app.use(V2_API_URL, authRoutes);

app.use(BASE_API_URL, deathsRoute);
app.use(BASE_API_URL, protestsRoute);
app.use(BASE_API_URL, pandemicsRoute);
app.use(BASE_API_URL, childMalnutritions);

app.use(V2_API_URL, protestsRouteV2);
app.use(V2_API_URL, deathsRouteV2);
app.use(V2_API_URL, pandemicsRouteV2)

/* ROUTE SAMPLE F04 */
app.get("/samples/rm", (req, res) => {

  const data = [13.2, 12.9, 12.3];
  const avg = data.reduce((a, b) => a + b, 0) / data.length;


  res.send("Average stunting rate: " + avg.toFixed(1));

});

//com

app.use(svelteHandler);

/* START SERVER */
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));