import React from "react";
// import styled, { createGlobalStyle } from "styled-components";
import { Table, DatePicker } from "antd";
// import "./DataTable.css";
import "antd/dist/antd.css";

const { RangePicker } = DatePicker;

function DataTable({ data }) {
  let columns = [];

  // 데이터를 정상적으로 받아왔으면
  if (data) {
    const dataSource = new Array(data.length);
    const days = data && data[0] && data[0].daily.length;

    let trackName = [],
      albumName = [],
      artist = [],
      trackCode = [],
      albumCode = [],
      trackNameFilter = [],
      albumNameFilter = [],
      artistFilter = [],
      trackCodeFilter = [],
      albumCodeFilter = [];

    // 필터 리스트 배열 (중복 제거 루틴)
    for (let i = 0; i < data.length; i++) {
      trackName.push(data[i].trackName);
    }
    trackName = Array.from(new Set(trackName));
    trackNameFilter = new Array(trackName.length);
    for (let i = 0; i < trackName.length; i++) {
      trackNameFilter[i] = new Object();
      trackNameFilter[i].text = trackName[i];
      trackNameFilter[i].value = trackName[i];
    }
    console.log(trackNameFilter);

    for (let i = 0; i < data.length; i++) {
      albumName.push(data[i].albumName);
    }
    albumName = Array.from(new Set(albumName));
    albumNameFilter = new Array(albumName.length);
    for (let i = 0; i < albumName.length; i++) {
      albumNameFilter[i] = new Object();
      albumNameFilter[i].text = albumName[i];
      albumNameFilter[i].value = albumName[i];
    }

    for (let i = 0; i < data.length; i++) {
      artist.push(data[i].artist);
    }
    artist = Array.from(new Set(artist));
    artistFilter = new Array(artist.length);
    for (let i = 0; i < artist.length; i++) {
      artistFilter[i] = new Object();
      artistFilter[i].text = artist[i];
      artistFilter[i].value = artist[i];
    }

    for (let i = 0; i < data.length; i++) {
      trackCode.push(data[i].trackCode);
    }
    trackCode = Array.from(new Set(trackCode));
    trackCodeFilter = new Array(trackCode.length);
    for (let i = 0; i < trackCode.length; i++) {
      trackCodeFilter[i] = new Object();
      trackCodeFilter[i].text = trackCode[i];
      trackCodeFilter[i].value = trackCode[i];
    }

    for (let i = 0; i < data.length; i++) {
      albumCode.push(data[i].albumCode);
    }
    albumCode = Array.from(new Set(albumCode));
    albumCodeFilter = new Array(albumCode.length);
    for (let i = 0; i < albumCode.length; i++) {
      albumCodeFilter[i] = new Object();
      albumCodeFilter[i].text = albumCode[i];
      albumCodeFilter[i].value = albumCode[i];
    }

    // 컬럼 정의
    columns = [
      {
        title: "트랙명",
        dataIndex: "trackName",
        key: "trackName",
        align: "center",
        width: 300,
        fixed: "left",
        filters: trackNameFilter,
        onFilter: (value, record) => record.trackName.indexOf(value) === 0,
      },
      {
        title: "음반명",
        dataIndex: "albumName",
        key: "albumName",
        align: "center",
        width: 200,
        fixed: "left",
        filters: albumNameFilter,
        onFilter: (value, record) => record.albumName.indexOf(value) === 0,
      },
      {
        title: "아티스트",
        dataIndex: "artist",
        key: "artist",
        align: "center",
        width: 150,
        filters: artistFilter,
        onFilter: (value, record) => record.artist.indexOf(value) === 0,
      },
      {
        title: "트랙코드",
        dataIndex: "trackCode",
        key: "trackCode",
        align: "center",
        width: 150,
        filters: trackCodeFilter,
        onFilter: (value, record) => record.trackCode.indexOf(value) === 0,
      },
      {
        title: "음반코드",
        dataIndex: "albumCode",
        key: "albumCode",
        align: "center",
        width: 150,
        filters: albumCodeFilter,
        onFilter: (value, record) => record.albumCode.indexOf(value) === 0,
      },
    ];

    // 일자별 데이터 컬럼 추가
    for (let i = 0; i < days; i++) {
      columns.push({
        title: `${data[0].daily[i].date}`,
        key: "date",
        align: "center",
        children: [
          {
            title: "ST",
            dataIndex: `st_${data[0].daily[i].date}`,
            key: `st_${data[0].daily[i].date}`,
            align: "center",
            width: 80,
          },
          {
            title: "DL",
            dataIndex: `dl_${data[0].daily[i].date}`,
            key: `dl_${data[0].daily[i].date}`,
            align: "center",
            width: 80,
          },
          {
            title: `저작인접권료`,
            dataIndex: `royalty_${data[0].daily[i].date}`,
            key: `royalty_${data[0].daily[i].date}`,
            align: "center",
            width: 120,
          },
        ],
      });
    }
    for (let i = 0; i < data.length; i++) {
      dataSource[i] = {
        key: i,
        trackName: data[i].trackName,
        albumName: data[i].albumName,
        artist: data[i].artist,
        trackCode: data[i].trackCode,
        albumCode: data[i].albumCode,
      };
      for (let j = 0; j < days; j++) {
        dataSource[i] = {
          ...dataSource[i],
          [`st_${data[i].daily[j].date}`]:
            data[i].daily[j][`st_${data[i].daily[j].date}`] * 1,
          [`dl_${data[i].daily[j].date}`]:
            data[i].daily[j][`dl_${data[i].daily[j].date}`] * 1,
          [`royalty_${data[i].daily[j].date}`]:
            data[i].daily[j][`royalty_${data[i].daily[j].date}`] * 1,
        };
      }
    }
    return (
      <div>
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          scroll={{ x: 0 }}
          size="small"
          /*scroll={{ x: "calc(700px + 50%)", y: 240 }*/
        />
        <RangePicker />
      </div>
    );
  }
}
export default DataTable;
