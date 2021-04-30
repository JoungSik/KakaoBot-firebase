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

exports.v1 = functions.https.onRequest(app);
