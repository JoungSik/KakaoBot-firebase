const functions = require('firebase-functions');
const router = require("express").Router();

const _ = require("lodash");

const moment = require("moment");
require("moment-timezone");

moment.locale("ko");
moment.tz.setDefault("Asia/Seoul");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const iconv = require("iconv-lite");

const luck = require("../api/luck");

const convert_type = (type) => {
  switch (type) {
    case "쥐띠":
      return "00";
    case "소띠":
      return "01";
    case "호랑이띠":
      return "02";
    case "토끼띠":
      return "03";
    case "용띠":
      return "04";
    case "뱀띠":
      return "05";
    case "말띠":
      return "06";
    case "양띠":
      return "07";
    case "원숭이띠":
      return "08";
    case "닭띠":
      return "09";
    case "개띠":
      return "10";
    case "돼지띠":
      return "11";
  }
};

router.get("/", (req, res) => {
  if (_.isEmpty(req.query.type)) {
    res.status(200).json({ msg: "띠를 입력해주세요." });
  } else {
    const type = convert_type(req.query.type);
    luck(type).then(r => {
      const result = iconv.decode(r.data, "EUC-KR");
      const dom = new JSDOM(result);

      const date = dom.window.document.querySelector("strong.date").textContent;
      const total = dom.window.document.querySelector("td#con_txt").textContent;

      let answers = [];
      const years = dom.window.document.querySelectorAll("div.today_year");
      for (let i = 0; i < 2; i++) {
        const year = years[i].querySelector("td.year").textContent;
        const answer = years[i].querySelector("div.year_td_box02").textContent;
        answers.push(`${year.substring(2, 4)}년생, ${answer}`);
      }

      const msg = `${date} ${req.query.type} 운세\n${total}\n\n` + answers.join("\n\n");
      res.status(200).json({ msg: msg });
    }).catch(e => {
      functions.logger.error(e);
      res.status(200).json({ msg: "운세를 가져오는데 실패했습니다." });
    })
  }
});

module.exports = router;
