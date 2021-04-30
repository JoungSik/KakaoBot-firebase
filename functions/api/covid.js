const axios = require("axios");

const API_KEY = "4TqebYMjj4Bt5gcV1R%2BDNt3GYn%2BHcqkVAi%2F9LKOIuwkXfjKrUWhWkHG%2Ba47BUYaSPUn1B0tdJPJQWLtFD1p%2F0A%3D%3D";

const local_covid = (date) =>
  axios.get(`http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${API_KEY}&pageNo=1&numOfRows=10&startCreateDt=${date}&endCreateDt=${date}`);

module.exports = local_covid;


