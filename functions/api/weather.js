const functions = require('firebase-functions');
const axios = require("axios");

const weather = ({ x, y, date, time }) =>
  axios.get("http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtFcst", {
    params: {
      serviceKey: functions.config().data_ko.key,
      pageNo: 1,
      numOfRows: 50,
      dataType: "JSON",
      base_date: date,
      base_time: time,
      nx: x,
      ny: y,
    },
  });

module.exports = weather;
