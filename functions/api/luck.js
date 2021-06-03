const axios = require("axios");

const luck = (type, isAstro) => {
  if (isAstro) {
    const params = new URLSearchParams();
    params.append("iAstro", type);
    params.append("dateparam", "0");
    
    return axios.post("https://fortune.nate.com/contents/freeunse/todaystar.nate", params, {
      responseType: "arraybuffer",
    });
  } else {
    const params = new URLSearchParams();
    params.append("jijiPage", "0");
    params.append("jijiparam", type);
    params.append("dateparam", "0");

    return axios.post("https://fortune.nate.com/contents/freeunse/dayjiji.nate", params, {
      responseType: "arraybuffer",
    });
  }
}

module.exports = luck;
