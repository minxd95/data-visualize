import React from "react";
import "./style.css";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Tooltip,
  Legend,
  Label,
} from "recharts";

function DataChart({ data, filter }) {
  let result = [];

  // 전체 or 선택필터 분기처리
  if (filter.trackName === "전체") {
    for (let i = 0; i < data.length; i++) {
      result[i] = {};
      result[i].date = data[i].trackName;
      result[i].stdl = 0;
      result[i].royalty = 0;
      for (let j = 0; j < data[i].daily.length; j++) {
        result[i].stdl += data[i].daily[j].stdl;
        result[i].royalty += data[i].daily[j].royalty;
      }
      result[i].royalty = Math.round(result[i].royalty * 100) / 100;
    }
  } else if (filter.trackCode === "전체") {
    for (let i = 0; i < data.length; i++) {
      result[i] = {};
      result[i].date = data[i].trackCode;
      result[i].stdl = 0;
      result[i].royalty = 0;
      for (let j = 0; j < data[i].daily.length; j++) {
        result[i].stdl += data[i].daily[j].stdl;
        result[i].royalty += data[i].daily[j].royalty;
      }
      result[i].royalty = Math.round(result[i].royalty * 100) / 100;
    }
  } else {
    for (let p in filter) {
      let found = {};
      if (filter[p]) {
        for (let i = 0; i < data.length; i++) {
          found = data.find((e) => e[p] === filter[p]);
          result = found.daily;
        }
      }
    }
  }
  return (
    <div>
      <LineChart
        width={1300}
        height={400}
        data={result}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" domain={[0, "auto"]}>
          <Label value="ST+DL" offset={5} angle={-90} position="insideLeft" />
        </YAxis>
        <YAxis yAxisId="right" orientation="right" domain={["minData", "auto"]}>
          <Label value="Royalty" offset={5} angle={90} position="insideRight" />
        </YAxis>
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="stdl"
          name="스트리밍+다운로드"
          stroke="#8884d8"
          activeDot={false}
          dot={false}
        />

        <Line
          yAxisId="right"
          type="monotone"
          dataKey="royalty"
          name="저작인접권료"
          stroke="#82ca9d"
          activeDot={false}
          dot={false}
        />
      </LineChart>
    </div>
  );
}

export default DataChart;
