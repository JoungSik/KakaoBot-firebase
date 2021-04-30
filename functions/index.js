const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();
const app = express();

const covidRouter = require("./route/covid");

app.use("/covid", covidRouter);

module.exports.v1 = functions.https.onRequest(app);
