const express = require("express");
const router = express.Router();

const hangang_temp = require("../api/hangang");

router.get("/", (req, res) => {
  hangang_temp().then((response) => {
    const data = response.data[1];
    if (response.data[0].result === "success") {
      res.status(response.status).json(data);
    } else {
      res.status(400).json(data);
    }
  }).catch((error) => {
    console.log(error);
  });
});

module.exports = router;
