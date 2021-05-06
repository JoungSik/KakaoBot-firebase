const functions = require('firebase-functions');
const axios = require("axios");

const dust = (city) =>
  axios.get("http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty", {
    params: {
      serviceKey: functions.config().data_ko.key,
      returnType: "json",
      pageNo: 1,
      numOfRows: 100,
      stationName: city,
      dataTerm: "DAILY",
      ver: 1.0,
    },
  });

module.exports = dust;
