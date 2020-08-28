import express from "express";
import fs from "fs";
import parseXlsx from "excel";
import multer from "multer";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

/* 업로드 모듈 설정 부분 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/kakao_daily/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
/*-----------------------*/

router.post("/upload", upload.array("file"), async (req, res) => {
  // 컬럼별 인덱스 저장 변수 선언
  for (let o = 0; o < req.files.length; o++) {
    let trackName = 0,
      trackCode = 0,
      albumName = 0,
      albumCode = 0,
      artist = 0,
      start = 0;
    const data = await parseXlsx(
      "./uploads/kakao_daily/" + req.files[o].originalname
    );
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
      resultJson[i - 2] = {
        trackName: data[i][trackName].trim(),
        trackCode: data[i][trackCode].trim(),
        albumName: data[i][albumName].trim(),
        albumCode: data[i][albumCode].trim(),
        artist: data[i][artist].trim(),
        daily: new Array((data[0].length - start + 1) / 4),
      };
      /* 일자별 데이터 저장 시작 */
      // 총 몇일 인지 계산하여 배열 메모리 할당
      // 정보이용료,st,dl,저작인접권료가 모두 있다는 가정 하에 4로 나눔
      for (let j = start, k = 0; j < data[0].length; j = j + 4, k++) {
        resultJson[i - 2].daily[k] = {
          date: `${data[0][j - 1].trim().substring(0, 4)}-${data[0][j - 1]
            .trim()
            .substring(4, 6)}-${data[0][j - 1].trim().substring(6, 8)}`,
          [`st_${data[0][j - 1].trim().substring(0, 4)}-${data[0][j - 1]
            .trim()
            .substring(4, 6)}-${data[0][j - 1].trim().substring(6, 8)}`]: data[
            i
          ][j],
          [`dl_${data[0][j - 1].trim().substring(0, 4)}-${data[0][j - 1]
            .trim()
            .substring(4, 6)}-${data[0][j - 1].trim().substring(6, 8)}`]: data[
            i
          ][j + 1],
          [`royalty_${data[0][j - 1].trim().substring(0, 4)}-${data[0][j - 1]
            .trim()
            .substring(4, 6)}-${data[0][j - 1].trim().substring(6, 8)}`]:
            Math.round(data[i][j + 2] * 100) / 100,
        };
      }
      /*--------------------------*/
    }
    /* JSON으로 저장 */
    try {
      fs.writeFileSync(
        "./data/kakao_daily/" +
          req.files[o].originalname.split(".")[0] +
          ".json",
        JSON.stringify(resultJson)
      );
      res.json({ message: "success", data: resultJson });
    } catch (err) {
      res.status(500).json(err);
    }
    /*--------------*/
  }
});
router.get("/merge", (req, res) => {
  /* 파일 목록 불러와서 파일들의 데이터를 data 배열에 저장 */
  fs.readdir("./data/kakao_daily", (err, files) => {
    const data = new Array(files.length);
    let trackCodeList = new Array();
    for (let i = 0; i < data.length; i++) {
      data[i] = JSON.parse(
        fs.readFileSync("./data/kakao_daily/" + files[i], "utf-8")
      );
      for (let j = 0; j < data[i].length; j++) {
        trackCodeList.push(data[i][j].trackCode);
      }
    }
    // 중복 제거
    trackCodeList = Array.from(new Set(trackCodeList));

    // 합치기
    let found = {};
    const result = new Array(trackCodeList.length);
    const resultTotal = new Array(trackCodeList.length);

    for (let i = 0; i < trackCodeList.length; i++) {
      result[i] = {};
      result[i].daily = [];
    }

    // 중복되지 않는 리스트를 만들어 데이터 재가공
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < trackCodeList.length; i++) {
        found = data[k].find((e) => e.trackCode == trackCodeList[i]);
        result[i] = {
          trackName: found.trackName,
          trackCode: found.trackCode,
          albumName: found.albumName,
          albumCode: found.albumCode,
          artist: found.artist,
          ...result[i],
        };
        result[i].daily.push(...found.daily);

        // 합 계산
        let stTotal = 0,
          dlTotal = 0,
          royaltyTotal = 0;
        for (let j = 0; j < result[i].daily.length; j++) {
          stTotal += result[i].daily[j][`st_${result[i].daily[j].date}`] * 1;
          dlTotal += result[i].daily[j][`dl_${result[i].daily[j].date}`] * 1;
          royaltyTotal +=
            result[i].daily[j][`royalty_${result[i].daily[j].date}`];
        }
        result[i].stTotal = stTotal;
        result[i].dlTotal = dlTotal;
        result[i].royaltyTotal = Math.round(royaltyTotal * 100) / 100;
      }
    }
    res.json(result);
  });
  /*-------------------------------------------------------*/
});
router.get("/merge/chart", (req, res) => {
  // 차트용 데이터 반환 라우터
  /* 파일 목록 불러와서 파일들의 데이터를 data 배열에 저장 */
  fs.readdir("./data/kakao_daily", (err, files) => {
    const data = new Array(files.length);
    let trackCodeList = new Array();
    for (let i = 0; i < data.length; i++) {
      data[i] = JSON.parse(
        fs.readFileSync("./data/kakao_daily/" + files[i], "utf-8")
      );
      for (let j = 0; j < data[i].length; j++) {
        trackCodeList.push(data[i][j].trackCode);
      }
    }
    // 중복 제거
    trackCodeList = Array.from(new Set(trackCodeList));

    // 합치기
    let found = {};
    const result = new Array(trackCodeList.length);
    const resultTotal = new Array(trackCodeList.length);

    for (let i = 0; i < trackCodeList.length; i++) {
      result[i] = {};
      result[i].daily = [];
    }

    // 중복되지 않는 리스트를 만들어 데이터 재가공
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < trackCodeList.length; i++) {
        found = data[k].find((e) => e.trackCode == trackCodeList[i]);
        result[i] = {
          trackName: found.trackName,
          trackCode: found.trackCode,
          albumName: found.albumName,
          albumCode: found.albumCode,
          artist: found.artist,
          ...result[i],
        };
        result[i].daily.push(...found.daily);
      }
    }
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[i].daily.length; j++) {
        result[i].daily[j].stdl =
          result[i].daily[j][`st_${result[i].daily[j].date}`] * 1 +
          result[i].daily[j][`dl_${result[i].daily[j].date}`] * 1;
        result[i].daily[j].royalty =
          result[i].daily[j][`royalty_${result[i].daily[j].date}`];
        delete result[i].daily[j][`st_${result[i].daily[j].date}`];
        delete result[i].daily[j][`dl_${result[i].daily[j].date}`];
        delete result[i].daily[j][`royalty_${result[i].daily[j].date}`];
      }
    }
    /*-------------------------------------------------------*/
    res.json(result);
  });
});
router.get("/merge/chart/:from/:to", (req, res) => {
  // 차트용 데이터 반환 라우터
  /* 파일 목록 불러와서 파일들의 데이터를 data 배열에 저장 */
  fs.readdir("./data/kakao_daily", (err, files) => {
    const data = new Array(files.length);
    let trackCodeList = new Array();
    for (let i = 0; i < data.length; i++) {
      data[i] = JSON.parse(
        fs.readFileSync("./data/kakao_daily/" + files[i], "utf-8")
      );
      for (let j = 0; j < data[i].length; j++) {
        trackCodeList.push(data[i][j].trackCode);
      }
    }
    // 중복 제거
    trackCodeList = Array.from(new Set(trackCodeList));

    // 합치기
    let found = {};
    const result = new Array(trackCodeList.length);
    const resultTotal = new Array(trackCodeList.length);

    for (let i = 0; i < trackCodeList.length; i++) {
      result[i] = {};
      result[i].daily = [];
    }

    // 중복되지 않는 리스트를 만들어 데이터 재가공
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < trackCodeList.length; i++) {
        found = data[k].find((e) => e.trackCode == trackCodeList[i]);
        result[i] = {
          trackName: found.trackName,
          trackCode: found.trackCode,
          albumName: found.albumName,
          albumCode: found.albumCode,
          artist: found.artist,
          ...result[i],
        };
        result[i].daily.push(...found.daily);
      }
    }
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[i].daily.length; j++) {
        result[i].daily[j].stdl =
          result[i].daily[j][`st_${result[i].daily[j].date}`] * 1 +
          result[i].daily[j][`dl_${result[i].daily[j].date}`] * 1;
        result[i].daily[j].royalty =
          result[i].daily[j][`royalty_${result[i].daily[j].date}`];
        delete result[i].daily[j][`st_${result[i].daily[j].date}`];
        delete result[i].daily[j][`dl_${result[i].daily[j].date}`];
        delete result[i].daily[j][`royalty_${result[i].daily[j].date}`];
      }
    }
    /*-------------------------------------------------------*/
    /*-------------------날짜로 자르기-----------------------*/
    if (req.params.from && req.params.to) {
      for (let i = 0; i < result.length; i++) {
        const tmp = [];
        for (let j = 0; j < result[i].daily.length; j++) {
          if (
            new Date(result[i].daily[j].date) >= new Date(req.params.from) &&
            new Date(result[i].daily[j].date) <= new Date(req.params.to)
          ) {
            tmp.push(result[i].daily[j]);
          }
        }
        result[i].daily = tmp;
      }
    }
    /*----------------------------------------------------*/
    res.json(result);
  });
});
router.get("/getlist", (req, res) => {
  fs.readdir("./data/kakao_daily", (err, files) => {
    res.json(files);
  });
});
router.post("/delete", (req, res) => {
  fs.unlink("./data/kakao_daily/" + req.body.file, (err) => {
    if (err) return res.status(500).json(err);
    fs.unlink(
      "./uploads/kakao_daily/" + req.body.file.replace(/.json/gi, ".xlsx"),
      (err) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(err);
      }
    );
  });
});
router.post("/reset", (req, res) => {
  for (let i = 0; i < req.body.dataList.length; i++) {
    try {
      fs.unlinkSync(
        __dirname.replace("\\routes", "") +
          "\\data\\kakao_daily\\" +
          req.body.dataList[i] // "\\" => "/"
      );
      fs.unlinkSync(
        __dirname.replace("\\routes", "") +
          "\\uploads\\kakao_daily\\" + // "\\" => "/"
          req.body.dataList[i].replace(/.json/gi, ".xlsx")
      );
    } catch (err) {
      console.log(err);
      return res.json(err);
    }
  }

  res.json({ message: "success" });
});
router.get("/date", (req, res) => {
  /* 파일 목록 불러와서 파일들의 데이터를 data 배열에 저장 */
  fs.readdir("./data/kakao_daily", (err, files) => {
    const data = new Array(files.length);
    let trackCodeList = new Array();
    for (let i = 0; i < data.length; i++) {
      data[i] = JSON.parse(
        fs.readFileSync("./data/kakao_daily/" + files[i], "utf-8")
      );
      for (let j = 0; j < data[i].length; j++) {
        trackCodeList.push(data[i][j].trackCode);
      }
    }
    // 중복 제거
    trackCodeList = Array.from(new Set(trackCodeList));

    // 합치기
    let found = {};
    const result = new Array(trackCodeList.length);
    const resultTotal = new Array(trackCodeList.length);

    for (let i = 0; i < trackCodeList.length; i++) {
      result[i] = {};
      result[i].daily = [];
    }

    // 중복되지 않는 리스트를 만들어 데이터 재가공
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < trackCodeList.length; i++) {
        found = data[k].find((e) => e.trackCode == trackCodeList[i]);
        result[i] = {
          trackName: found.trackName,
          trackCode: found.trackCode,
          albumName: found.albumName,
          albumCode: found.albumCode,
          artist: found.artist,
          ...result[i],
        };
        result[i].daily.push(...found.daily);
      }
    }
    for (let i = 0; i < result.length; i++) {
      const tmp = [];
      for (let j = 0; j < result[i].daily.length; j++) {
        if (
          new Date(result[i].daily[j].date) >= new Date(req.query.from) &&
          new Date(result[i].daily[j].date) <= new Date(req.query.to)
        ) {
          tmp.push(result[i].daily[j]);
        }
      }
      result[i].daily = tmp;
      // 합 계산
      let stTotal = 0,
        dlTotal = 0,
        royaltyTotal = 0;
      for (let j = 0; j < result[i].daily.length; j++) {
        stTotal += result[i].daily[j][`st_${result[i].daily[j].date}`] * 1;
        dlTotal += result[i].daily[j][`dl_${result[i].daily[j].date}`] * 1;
        royaltyTotal +=
          result[i].daily[j][`royalty_${result[i].daily[j].date}`];
      }
      result[i].stTotal = stTotal;
      result[i].dlTotal = dlTotal;
      result[i].royaltyTotal = Math.round(royaltyTotal * 100) / 100;
    }
    res.json(result);
  });
  /*-------------------------------------------------------*/
});
export default router;
