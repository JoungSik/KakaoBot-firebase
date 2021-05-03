const axios = require("axios");

const hangang_temp = () => axios.get("https://api.qwer.pw/request/hangang_temp", {
  params: {
    apikey: "guest",
  },
});

module.exports = hangang_temp;
