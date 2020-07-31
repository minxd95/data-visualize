import React, { useState, useEffect } from "react";
import DataTable from "./components/DataTable";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/kakao/daily/merge").then(({ data }) => {
      setData(data);
    });
  }, []);

  return <div>{data && <DataTable data={data} />}</div>;
}

export default App;
