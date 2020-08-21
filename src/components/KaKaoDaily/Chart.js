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
} from "recharts";

function Chart({ data, filter }) {
  let result = [];
  for (let p in filter) {
    let found = {};
    if (filter[p]) {
      for (let i = 0; i < data.length; i++) {
        found = data.find((e) => e[p] === filter[p]);
        result = found.daily;
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
        <YAxis yAxisId="left" domain={[0, "auto"]} />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={["minData", "auto"]}
        />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="stdl"
          stroke="#8884d8"
          activeDot={false}
          dot={false}
        />

        <Line
          yAxisId="right"
          type="monotone"
          dataKey="royalty"
          stroke="#82ca9d"
          activeDot={false}
          dot={false}
        />
      </LineChart>
    </div>
  );
}

export default Chart;
