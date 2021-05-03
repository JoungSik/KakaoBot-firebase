const functions = require('firebase-functions');
const router = require("express").Router();

const _ = require("lodash");

const moment = require("moment");
require("moment-timezone");

moment.locale("ko");
moment.tz.setDefault("Asia/Seoul");

const local_covid = require("../api/covid");

router.get("/", (req, res) => {
  const date = _.isEmpty(req.query.date) ? moment().format("YYYYMMDD") : req.query.date;
  local_covid(date).then((r) => {
    if (_.isEmpty(r.data.response.body.items)) {
      res.status(200).json({ msg: `${moment().format("LLLL")} 코로나 데이터는 발표 전 입니다.` });
    } else {
      const item = r.data.response.body.items.item.filter((item) => item.gubun === req.query.area)[0];
      if (_.isEmpty(item)) {
        res.status(200).json({ msg: "지역을 못찾았습니다." });
      } else {
        const msg = `${moment(item.createDt).format("LLLL")} 기준, ${item.gubun} 지역 추가 확진자: ${item.incDec}명`;
        res.status(200).json({ msg: msg });
      }
    }
  }).catch((e) => {
    functions.logger.error(e);
  });
});

module.exports = router;
