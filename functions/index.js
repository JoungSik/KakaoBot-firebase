const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();
const app = express();

const hangangRouter = require("../functions/route/hangang");
const covidRouter = require("../functions/route/covid");

app.get("/", (req, res) => {
  const result = { "name": "JoungSik" };
  res.status(200).json(result);
});

app.use("/hangang", hangangRouter);
app.use("/covid", covidRouter);

app.get("/hello", (req, res) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
  res.send(`
    <!doctype html>
    <head>
      <title>Time</title>
      <link rel="stylesheet" href="/style.css">
      <script src="/script.js"></script>
    </head>
    <body>
      <p>In London, the clock strikes:
        <span id="bongs">${'BONG '.repeat(hours)}</span></p>
      <button onClick="refresh(this)">Refresh</button>
    </body>
  </html>`);
});

exports.v1 = functions.https.onRequest(app);


// const functions = require("firebase-functions");
//
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });
