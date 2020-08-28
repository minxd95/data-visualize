import React, { useState, useEffect } from "react";
import axios from "axios";

import DataChart from "./DataChart";
import Filter from "./Filter";
import DatePicker from "./DatePicker";

function Main() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ trackName: "", trackCode: "" });
  const init = { trackName: "", trackCode: "" };

  function handleChangeFilter(e) {
    setFilter({ ...init, [e.target.name]: e.target.value });
  }

  async function fetchByDate(date) {
    const response = await axios.get(
      `http://localhost:3000/kakao/daily/merge/chart/${date.from}/${date.to}`
    );
    if (!response) return;
    setData(response.data);
  }

  async function fetchData(date) {
    axios
      .get("http://localhost:3000/kakao/daily/merge/chart/")
      .then((response) => {
        setData(response.data);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <DataChart data={data} filter={filter} />
      <Filter data={data} filter={filter} onFilterChange={handleChangeFilter} />
      <DatePicker dateChanged={fetchByDate} onReset={fetchData} />
    </div>
  );
}

export default Main;
