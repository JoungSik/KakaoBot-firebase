const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();
const app = express();

const covidRouter = require("./route/covid");
const weatherRouter = require("./route/weather");
const luckRouter = require("./route/luck");

app.use("/covid", covidRouter);
app.use("/weather", weatherRouter);
app.use("/luck", luckRouter);

module.exports.v1 = functions.https.onRequest(app);
