import React, { useState, useEffect } from "react";
import Chart from "../components/KaKaoDaily/Chart";
import axios from "axios";
import { makeFilterList } from "../library/dataParsing";
function KaKaoDailyChartRouter() {
  const [filter, setFilter] = useState({ trackName: "", trackCode: "" });
  const [data, setData] = useState([]);

  const init = { trackName: "", trackCode: "" };

  function handleChangeFilter(e) {
    setFilter({ ...init, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000/kakao/daily/merge/chart")
      .then((response) => {
        setData(response.data);
      });
  }, []);

  const { trackName, trackCode, albumName, albumCode, artist } = makeFilterList(
    data
  );

  const trackNameFilter = trackName.map((e) => <option value={e}>{e}</option>);
  const trackCodeFilter = trackCode.map((e) => <option value={e}>{e}</option>);

  return (
    <div className="container">
      <Chart data={data} filter={filter} />
      <div className="filter">
        <span>트랙이름으로 필터링 : </span>
        <select
          name="trackName"
          value={filter.trackName}
          onChange={handleChangeFilter}
        >
          <option value=""></option>
          {trackNameFilter}
        </select>
      </div>
      <div className="filter">
        <span>트랙코드로 필터링 : </span>
        <select
          name="trackCode"
          value={filter.trackCode}
          onChange={handleChangeFilter}
        >
          <option value=""></option>
          {trackCodeFilter}
        </select>
      </div>
    </div>
  );
}

export default KaKaoDailyChartRouter;
