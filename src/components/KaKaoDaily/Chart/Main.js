import React, { useState, useEffect } from "react";
import axios from "axios";

import DataChart from "./DataChart";
import Filter from "./Filter";
function Main() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ trackName: "", trackCode: "" });
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

  return (
    <div>
      <DataChart data={data} filter={filter} />
      <Filter data={data} filter={filter} onFilterChange={handleChangeFilter} />
    </div>
  );
}

export default Main;
