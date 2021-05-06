const functions = require("firebase-functions");
const router = require("express").Router();

const _ = require("lodash");

const moment = require("moment");
require("moment-timezone");

moment.locale("ko");
moment.tz.setDefault("Asia/Seoul");

const dust = require("../api/dust");

const convert_dust_state = (value) => {
  switch (parseInt(value)) {
    case 1:
      return "좋음";
    case 2:
      return "보통";
    case 3:
      return "나쁨";
    case 4:
      return "매우 나쁨";
  }
};

router.get("/", (req, res) => {
  dust(req.query.city).then(r => {
    if (r.data.response.body.items.length > 0) {
      const item = r.data.response.body.items[0];
      if (_.isEmpty(item)) {
        res.status(200).json({ msg: "관측소를 찾지 못했어요!" });
      } else {
        let msg = `${moment(item.dataTime).format("LLLL")} 기준\n\n`;
        if (_.isEmpty(item.khaiGrade)) {
          msg += `${req.query.city}지역 관측소가 현재 ${item.pm10Flag} 상태 입니다.`;
        } else {
          msg += `${req.query.city}지역 미세먼지 등급은 ${convert_dust_state(item.khaiGrade)}. ${item.khaiValue}㎍/㎥ 입니다.`;
        }
        res.status(200).json({ msg: msg });
      }
    } else {
      res.status(200).json({ msg: "검색 결과가 없어요!" });
    }
  }).catch(e => {
    functions.logger.error(e);
  });
});

module.exports = router;
