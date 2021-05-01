const axios = require("axios");

const luck = (type) => {
  const params = new URLSearchParams();
  params.append("jijiPage", "0");
  params.append("jijiparam", type);
  params.append("dateparam", "0");

  return axios.post("https://fortune.nate.com/contents/freeunse/dayjiji.nate", params, {
    responseType: "arraybuffer",
  });
}

module.exports = luck;
