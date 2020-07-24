import React, { useState, useEffect } from "react";
// import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
import "./DataTable.css";

function DataTable(props) {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3000/kakao/daily/merge").then(({ data }) => {
      setData(data);
    });
  }, []);
  return (
    <div>
      {props.year}년 {props.month}월 {props.day}일
      <table>
        <thead>
          <tr>
            <th>트랙이름</th>
            <th>앨범이름</th>
            <th>아티스트</th>
            <th>ST</th>
            <th>DL</th>
            <th>저작인접권료</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.trackName}</td>
              <td>{item.albumName}</td>
              <td>{item.artist}</td>
              <td>{item.daily[0].st}</td>
              <td>{item.daily[0].dl}</td>
              <td>{item.daily[0].royalty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
