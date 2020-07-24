import express from "express";
import fs from "fs";
import parseXlsx from "excel";
import multer from "multer";

const router = express.Router();

/* 업로드 모듈 설정 부분 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
/*-----------------------*/

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.post("/upload", upload.single("file"), (req, res) => {
  // 컬럼별 인덱스 저장 변수 선언
  let trackName = 0,
    trackCode = 0,
    albumName = 0,
    albumCode = 0,
    artist = 0,
    start = 0;
  parseXlsx("./uploads/" + req.file.originalname).then((data) => {
    const resultJson = new Array(data.length - 2);
    /* 컬럼별 인덱스 저장 */
    for (let i = 0; i < data[0].length; i++) {
      if (data[0][i] == "곡명") trackName = i;
      if (data[0][i] == "LH곡코드") trackCode = i;
      if (data[0][i] == "음반명") albumName = i;
      if (data[0][i] == "LH음반코드") albumCode = i;
      if (data[0][i] == "아티스트") artist = i;
      if (data[1][i] == "ST" && start == 0 && data[0][i - 1] != "합계")
        // 합계가 아닌 일자별 데이터의 시작 인덱스 가져오기
        start = i;
    }
    /*--------------------*/
    for (let i = 2; i < data.length; i++) {
      // 0,1 행은 컬럼명이므로 2부터 시작
      resultJson[i - 2] = new Object();
      // string.trim() : 문자열 앞 뒤 공백 삭제 (혹시 모를 경우 대비)
      resultJson[i - 2].trackName = data[i][trackName].trim();
      resultJson[i - 2].trackCode = data[i][trackCode].trim();
      resultJson[i - 2].albumName = data[i][albumName].trim();
      resultJson[i - 2].albumCode = data[i][albumCode].trim();
      resultJson[i - 2].artist = data[i][artist].trim();
      /* 일자별 데이터 저장 시작 */
      resultJson[i - 2].daily = new Array((data[0].length - start + 1) / 4);
      // 총 몇일 인지 계산하여 배열 메모리 할당
      // 정보이용료,st,dl,저작인접권료가 모두 있다는 가정 하에 4로 나눔
      for (let j = start, k = 0; j < data[0].length; j = j + 4, k++) {
        resultJson[i - 2].daily[k] = new Object();
        resultJson[i - 2].daily[k].year =
          data[0][j - 1].trim().substring(0, 4) * 1;
        resultJson[i - 2].daily[k].month =
          data[0][j - 1].trim().substring(4, 6) * 1;
        resultJson[i - 2].daily[k].day =
          data[0][j - 1].trim().substring(6, 8) * 1;
        resultJson[i - 2].daily[k].st = data[i][j] * 1;
        resultJson[i - 2].daily[k].dl = data[i][j + 1] * 1;
        resultJson[i - 2].daily[k].royalty =
          Math.round(data[i][j + 2] * 100) / 100; // 소수점 2자리까지 반올림
      }
      /*--------------------------*/
    }
    /* JSON으로 저장 */
    fs.writeFile(
      "./data/" + req.file.originalname.split(".")[0] + ".json",
      JSON.stringify(resultJson),
      function (err) {
        if (err) return res.json(err);
        res.json({
          message: "success",
          data: resultJson,
        });
      }
    );
    /*--------------*/
  });
});

router.get("/merge", (req, res) => {
  /* 파일 목록 불러와서 파일들의 데이터를 data 배열에 저장 */
  fs.readdir("./data", (err, files) => {
    const data = new Array(files.length);
    for (let i = 0; i < data.length; i++)
      data[i] = JSON.parse(fs.readFileSync("./data/" + files[i], "utf-8"));
    res.json(data);
  });
  /*-------------------------------------------------------*/
});

export default router;
