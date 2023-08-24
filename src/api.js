const express = require("express");
const serverless = require("serverless-http");
const fs = require("fs");
const path = require("path");

// Create an instance of the Express app
const app = express();
const __dirname = path.resolve();

// Create a router to handle routes
const router = express.Router();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

router.get('/UF/', (req, res) => {
  res.header(headers);
  const sickImmunizer = req.query.sickImmunizer;
  const local = req.query.local;
  if (sickImmunizer) {
    if (sickImmunizer.includes(",")) {
      const result = {};
      for (let arg of sickImmunizer.split(",")) {
        result[arg] =
          JSON.parse(fs.readFileSync(
            path.join(
              __dirname,
              `./api/UF/${local}/sicks/${arg}.json`
            )
          ));
      }
      res.send(result);
    } else {
      res.sendFile(path.join(__dirname, `./api/UF/${local}/sicks/${sickImmunizer}.json`));
    }

    return;
  }

  const citiesAcronym = req.query.citiesAcronym;
  res.sendFile(path.join(__dirname, `./api/UF/${local}/${citiesAcronym}.json`));
});

router.get('/:arg', (req, res) => {
  res.header(headers);
  res.sendFile(path.join(__dirname, `./api/${req.params.arg}.json`));
});

router.get('/', (req, res) => {
  res.header(headers);
  const sickImmunizer = req.query.sickImmunizer;
  if (sickImmunizer) {
    if (sickImmunizer.includes(",")) {
      const sickImmunizers = sickImmunizer.split(",");
      const result = {};
      for (let arg of sickImmunizers) {
        result[arg] =
          JSON.parse(fs.readFileSync(
            path.join(
              __dirname,
              `./api/sicks/${arg}.json`
            )
          ));
      }
      res.send(result);

    } else {
      res.sendFile(path.join(__dirname, `./api/sicks/${req.query.sickImmunizer}.json`));
    }
    return;
  }
  const citiesAcronym = req.query.citiesAcronym;
  if (citiesAcronym) {
    res.sendFile(path.join(__dirname, `./api/${'citiesAcronym' + citiesAcronym}.json`));
  }
});

// Use the router to handle requests to the `/.netlify/functions/api` path
app.use(`/.netlify/functions/api`, router);

// Export the app and the serverless function
module.exports = app;
module.exports.handler = serverless(app);
