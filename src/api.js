const express = require("express");
const serverless = require("serverless-http");
const fs = require("fs");
const path = require("path");

// Create an instance of the Express app
const app = express();
const __dirname = path.resolve();

// Create a router to handle routes
const router = express.Router();

router.get('/:arg', (req, res) => {
  res.header("Content-Type",'application/json');
  if (req.params.arg.includes(",")){
    const args = req.params.arg.split(",");
    const result = {};
    for (let arg of args) {
      result[arg] = JSON.parse(fs.readFileSync(path.join(__dirname, `api/${arg}.json`)));
    }
    res.send(result)

    return;
  }

  res.sendFile(path.join(__dirname, `api/${req.params.arg}.json`));
});

router.get('/UF/:state/:arg', (req, res) => {
  res.header("Content-Type",'application/json');
  if (req.params.arg.includes(",")){
    const args = req.params.arg.split(",");
    const result = {};
    for (let arg of args) {
      result[arg] = JSON.parse(fs.readFileSync(path.join(__dirname, `./api/${arg}.json`)));
    }
    res.send(result)

    return;
  }

  res.sendFile(path.join(__dirname, `./api/UF/${req.params.state}/${req.params.arg}.json`));
});

// Use the router to handle requests to the `/.netlify/functions/api` path
app.use(`/.netlify/functions/api`, router);

// Export the app and the serverless function
module.exports = app;
module.exports.handler = serverless(app);
