const functions = require('firebase-functions');
const admin = require("firebase-admin");

const router = require("express").Router();
const db = admin.firestore();

router.get("/add", (req, res) => {
  const foodRef = db.collection("foods").doc(req.query.type);
  foodRef.get().then(doc => {
    if (doc.exists) {
      foodRef.update({ names: Array.from(new Set(doc.data().names.concat(req.query.name))) })
        .then(() => {
          res.status(200).json({ msg: "입력 성공!" });
        })
        .catch(() => {
          res.status(200).json({ msg: "입력 실패!" });
        });
    } else {
      res.status(200).json({ msg: "No such document!" });
    }
  }).catch(error => {
    res.status(200).json({ msg: error });
  });
});

router.get("/", (req, res) => {
  const foodRef = db.collection("foods").doc(req.query.type);
  foodRef.get().then(doc => {
    if (doc.exists) {
      res.status(200).json({ msg: doc.data().names[Math.floor(Math.random() * doc.data().names.length)] });
    } else {
      res.status(200).json({ msg: "[ERROR] 정식 호출!!" });
    }
  }).catch(error => {
    res.status(200).json({ msg: "식사 시간을 다시 입력해주세요." });
  });
});

module.exports = router;
