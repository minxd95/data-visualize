import express from "express";
import kakaoDailyRouter from "./routes/kakao_daily";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/kakao/daily", kakaoDailyRouter);

app.listen(3000, () => console.log("Listening at port 3000"));
