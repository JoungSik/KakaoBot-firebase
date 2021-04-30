// 매시간 30분에 생성되며 약 10분마다 최신 정보로 업데이트(기온, 습도, 바람)
// ※ Base_time=1530 → 15시 30분부터 16시 30분 전까지 약 1시간동안 약 10분간격으로 업데이트
// (Base_time=1530으로 15시 30분부터 16시 30분 전까지 호출 시 사용)
// Base_time=1630 → 16시 30분부터 17시 30분 전까지 약 1시간동안 약 10분간격으로 업데이트
// (Base_time=1630으로 16시 30분부터 17시 30분 전까지 호출 시 사용)
// 예보 생성시간에 따라 API 제공 시간의 변동이 있을 수 있음

const convert_string = (value) => value < 10 ? "0" + value : value.toString();

const convert_weather_time = (time) => {
  if (parseInt(time) < 30) {
    return null;
  } else {
    return parseInt(time.substring(2, 4)) > 30 ? time.substring(0, 2) + "30" :
      convert_string(parseInt(time.substring(0, 2)) - 1) + "30";
  }
};

module.exports = convert_weather_time;
