const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();
const app = express();

const covidRouter = require("./route/covid");
const weatherRouter = require("./route/weather");
const luckRouter = require("./route/luck");
const dustRouter = require("./route/dust");
const foodRouter = require("./route/food");

app.use("/covid", covidRouter);
app.use("/weather", weatherRouter);
app.use("/luck", luckRouter);
app.use("/dust", dustRouter);
app.use("/food", foodRouter);

module.exports.v1 = functions.https.onRequest(app);
