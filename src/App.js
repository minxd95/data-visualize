import React, { useState, useEffect } from "react";
import DataTable from "./components/DataTable";
import DataList from "./components/DataList";
import axios from "axios";
import { Row, Col, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import "./style.css";

function App() {
  const [data, setData] = useState([]);
  const [dataList, setDataList] = useState([]);

  async function fetchData() {
    const response = await axios.get("http://localhost:3000/kakao/daily/merge");
    if (!response) return;
    setData(response.data);
  }

  async function fetchDataList() {
    const response = await axios.get(
      "http://localhost:3000/kakao/daily/getlist"
    );
    if (!response) return;
    setDataList(response.data);
  }

  const handleDelete = (key) => {
    let tempList = dataList;
    tempList.splice(key, 1);
    console.log(tempList);
    setDataList(tempList);
  };

  useEffect(() => {
    fetchData();
    fetchDataList();
  }, []);

  return (
    <div>
      <Row>
        <Col span={24}>{data && <DataTable data={data || []} />}</Col>
      </Row>
      <Row>
        <Col span={4} offset={1}>
          <DataList key="datalist" data={dataList} onDelete={handleDelete} />
        </Col>
        <Col>
          <Button>
            <UploadOutlined />
            Click to upload
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default App;
