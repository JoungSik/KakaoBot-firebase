const functions = require('firebase-functions');
const router = require("express").Router();

const _ = require("lodash");

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
    default:
      return null;
  }
};

const convert_star_type = (type) => {
  switch (type) {
    case "물병자리":
      return 0;
    case "물고기자리":
      return 1;
    case "양자리":
      return 2;
    case "황소자리":
      return 3;
    case "쌍둥이자리":
      return 4;
    case "게자리":
      return 5;
    case "사자자리":
      return 6;
    case "처녀자리":
      return 7;
    case "천칭자리":
      return 8;
    case "전갈자리":
      return 9;
    case "사수자리":
      return 10;
    case "염소자리":
      return 11;
    default:
      return null;
  }
}

router.get("/", (req, res) => {
  if (_.isEmpty(req.query.type)) {
    res.status(200).json({ msg: "띠를 입력해주세요." });
  } else {
    if (/띠/.test(req.query.type)) {
      const type = convert_type(req.query.type);
      if (_.isEmpty(type)) {
        res.status(200).json({ msg: "운세를 가져오는데 실패했습니다.\n쥐띠, 소띠, 호랑이띠, 토끼띠, 용띠, 뱀띠, 말띠, 양띠, 원숭이띠, 닭띠, 개띠, 돼지띠 중에서 입력해주세요." });
      } else {
        luck(type, false).then(r => {
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
        });
      }
    } else {
      const type = convert_star_type(req.query.type);
      if (type == null) {
        res.status(200).json({ msg: "운세를 가져오는데 실패했습니다.\n물병자리, 물고기자리, 양자리, 황소자리, 쌍둥이자리, 게자리, 사자자리, 처녀자리, 천칭자리, 전갈자리, 사수자리, 염소자리 중에서 입력해주세요." });
      } else {
        luck(type, true).then(r => {
          const result = iconv.decode(r.data, "EUC-KR");
          const dom = new JSDOM(result);

          const date = dom.window.document.querySelector("strong.date").textContent;
          const value = dom.window.document.querySelector("td#con_txt").textContent.replace(/\t/g, "");

          const titleItems = dom.window.document.querySelector("td.tip_bg_today").querySelectorAll("th");
          const luckItems = dom.window.document.querySelector("td.tip_bg_today").querySelectorAll("td");
          let answers = [];
          for (let i = 0; i < titleItems.length; i++) {
            const title = titleItems[i].title;
            const data = luckItems[i].querySelector("h5.adv").querySelector("em").textContent;
            answers.push(`${title}: ${data}`);
          }
          const msg = `${date} ${req.query.type} 운세\n\n${value}\n\n` + answers.join("\n");
          res.status(200).json({ msg: msg });
        }).catch(e => {
          functions.logger.error(e);
          res.status(200).json({ msg: "운세를 가져오는데 실패했습니다." });
        });
      }
    }
  }
});

module.exports = router;
