const functions = require("firebase-functions");
const router = require("express").Router();

const _ = require("lodash");

const moment = require("moment");
require("moment-timezone");

moment.locale("ko");
moment.tz.setDefault("Asia/Seoul");

const address2ll = require("../api/geocoding");
const convert_conv = require("../utils/convert_conv");
const weather = require("../api/weather");
const convert_weather_time = require("../utils/convert_weather_time");

// 하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4)
const convert_sky = (value) => {
  switch (parseInt(value)) {
    case 1:
      return "맑음";
    case 3:
      return "구름많음";
    case 4:
      return "흐림";
  }
};

// 강수형태(PTY) 코드 : 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4), 빗방울(5), 빗방울/눈날림(6), 눈날림(7)
// 여기서 비/눈은 비와 눈이 섞여 오는 것을 의미 (진눈개비)
const convert_pty = (value) => {
  switch (parseInt(value)) {
    case 0:
      return "없음";
    case 1:
      return "비";
    case 2:
      return "비/눈";
    case 3:
      return "눈";
    case 4:
      return "소나기";
    case 5:
      return "빗방울";
    case 6:
      return "빗방울/눈날림";
    case 7:
      return "눈날림";
  }
};

const convert_temp = (values) => {
  const temp = values.sort((a, b) => parseInt(a.fcstTime) - parseInt(b.fcstTime))[0];
  let time = temp.fcstTime.length === 3 ? "0" + temp.fcstTime : temp.fcstTime;
  time = parseInt(time.substring(0, 2)) >= 12 ? "오후 " + time.substring(0, 2) : "오전 " + time.substring(0, 2);
  return `${time}시 ${temp.fcstValue}°C`;
};

router.get("/", (req, res) => {
  const address = _.isEmpty(req.query.address) ? null : req.query.address;
  const date = moment().format("YYYYMMDD");
  const time = moment().format("hhmm");
  const convert_time = convert_weather_time(time);

  if (_.isEmpty(address)) {
    res.status(200).json({ msg: "지역을 못찾았습니다." });
  } else {
    address2ll(address)
      .then(r => {
        if (_.isEmpty(r.data.documents)) {
          res.status(200).json({ msg: "지역을 못찾았습니다." });
        } else {
          const target = r.data.documents[0].address_name;
          const lng = parseFloat(r.data.documents[0].x);
          const lat = parseFloat(r.data.documents[0].y);
          const rs = convert_conv("toXY", lat, lng);

          if (convert_time == null) {
            res.status(200).json({ msg: "날씨 정보가 업데이트 되기 전 입니다." });
          } else {
            weather({ x: rs.x, y: rs.y, date: date, time: convert_time }).then(r => {
              if (r.data.response.header.resultCode !== "00") {
                res.status(200).json({ msg: "날씨를 가져오지 못했습니다." });
              } else {
                let msg = `${moment(`${date} ${convert_time}`, "YYYYMMDD hhmm").format("LLLL")} 측정 기준 [${target}] 날씨\n\n`;
                const messages = [];

                const sky = r.data.response.body.items.item.filter(item => item.category === "SKY")[0];
                if (!_.isEmpty(sky)) {
                  messages.push(`하늘 상태는 ${convert_sky(sky.fcstValue)}`);
                }

                const pty = r.data.response.body.items.item.filter(item => item.category === "PTY")[0];
                if (!_.isEmpty(pty)) {
                  messages.push(`강수 형태는 ${convert_pty(pty.fcstValue)}`);
                }

                const temps = r.data.response.body.items.item.filter(item => item.category === "T1H");
                if (!_.isEmpty(temps)) {
                  messages.push(convert_temp(temps));
                }

                res.status(200).json({ msg: msg + messages.join("\n\n") });
              }
            }).catch(e => {
              functions.logger.error(e);
              res.status(200).json({ msg: "날씨를 가져오지 못했습니다." });
            });
          }
        }
      }).catch(e => {
      functions.logger.error(e);
      res.status(200).json({ msg: "지역을 못찾았습니다." });
    });
  }
});

module.exports = router;
