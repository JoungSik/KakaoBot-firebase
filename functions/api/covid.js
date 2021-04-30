const functions = require('firebase-functions');
const axios = require("axios");

const local_covid = (date) =>
  axios.get(`http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${functions.config().data_ko.key}&pageNo=1&numOfRows=10&startCreateDt=${date}&endCreateDt=${date}`);

module.exports = local_covid;


