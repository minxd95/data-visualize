import React, { useState, useEffect } from "react";
import DataTable from "./components/DataTable";
import DataList from "./components/DataList";
import UploadFile from "./components/UploadFile";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay";
import { Row, Col } from "antd";
import styled, { css } from "styled-components";
import "./style.css";

const DarkBackground = styled.div`
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */

  ${(props) =>
    props.disappear &&
    css`
      display: block; /* show */
    `}
`;

function App() {
  const [loaded, setLoaded] = useState(true);
  const [data, setData] = useState([]);
  const [dataList, setDataList] = useState([]);

  async function fetchData() {
    setLoaded(false);
    const response = await axios.get("http://localhost:3000/kakao/daily/merge");
    if (!response) return;
    setData(response.data);
    setLoaded(true);
  }

  async function fetchDataList() {
    const response = await axios.get(
      "http://localhost:3000/kakao/daily/getlist"
    );
    if (!response) return;
    setDataList(response.data);
  }

  const handleDelete = async (key, index) => {
    // 얕은 복사와 깊은 복사에 대해 공부하자
    await axios.post("http://localhost:3000/kakao/daily/delete", {
      file: dataList[key],
    });
    await fetchData();
    await setDataList(dataList.filter((d, inIndex) => inIndex !== index));
  };

  const handleUploaded = async () => {
    await fetchDataList();
    await fetchData();
  };

  useEffect(() => {
    fetchData();
    fetchDataList();
  }, []);

  return (
    <div>
      <DarkBackground disappear={!loaded}></DarkBackground>
      <LoadingOverlay
        active={!loaded}
        // spinner={<BounceLoader />}
        spinner={true}
        text="로딩중"
      >
        {/* <p>Some content or children or   something.</p> */}
        <Row gutter={[0, 6]}>
          <Col span={24}>{data && <DataTable data={data || []} />}</Col>
        </Row>
        <Row gutter={[0, 6]}>
          <Col span={4} offset={1}>
            <DataList key="datalist" data={dataList} onDelete={handleDelete} />
          </Col>
          <Col offset={1}>
            <UploadFile onUploaded={handleUploaded} />
          </Col>
        </Row>
      </LoadingOverlay>
    </div>
  );
}

export default App;
