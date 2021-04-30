const router = require("express").Router();

const _ = require("lodash");

const moment = require("moment");
require("moment-timezone");

moment.locale("ko");
moment.tz.setDefault("Asia/Seoul");

const local_covid = require("../api/covid");

router.get("/", (req, res) => {
  const date = _.isEmpty(req.query.date) ? moment().format("YYYYMMDD") : req.query.date;
  local_covid(date).then((response) => {
    const item = response.data.response.body.items.item.filter((item) => item.gubun === req.query.area)[0];

    if (_.isEmpty(item)) {
      res.status(200).json({ msg: "지역을 못찾았습니다." });
    } else {
      const msg = `${moment(item.createDt).format("LLLL")} 기준, ${item.gubun} 지역 추가 확진자: ${item.incDec}명`;
      res.status(200).json({ msg: msg });
    }
  }).catch((error) => {
    console.log(error);
  });
});

module.exports = router;