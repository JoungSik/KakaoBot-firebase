const functions = require('firebase-functions');
const axios = require("axios");

const address2ll = (address) =>
  axios.get(`https://dapi.kakao.com/v2/local/search/address.json?analyze_type=similar&page=1&size=10&query=${encodeURI(address)}`, {
    headers: {
      Authorization: `KakaoAK ${functions.config().kakao.key}`,
    },
  });

module.exports = address2ll;


