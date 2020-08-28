import express from "express";
import kakaoDailyRouter from "./routes/kakao_daily";
import kakaoMonthlyRouter from "./routes/kakao_monthly";
import cors from "cors";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/kakao/daily", kakaoDailyRouter);
app.use("/kakao/monthly", kakaoMonthlyRouter);

app.listen(3000, () => console.log("Listening at port 3000"));
