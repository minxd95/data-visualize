import React, { useState, useEffect } from "react";
// import styled, { createGlobalStyle } from "styled-components";
// import { Table, DatePicker } from "antd";
import { List, Button } from "antd";
import "antd/dist/antd.css";

const DataList = (props) => {
  const { onDelete, onReset, data } = props;
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const tempList = [];
    for (let i = 0; i < data.length; i++) {
      tempList.push({
        content: data[i],
        key: i,
      });
    }
    setFileList(tempList);
  }, [data]);

  return (
    <div>
      <List
        size="small"
        header={<div>파일 목록</div>}
        bordered
        dataSource={fileList}
        pagination={{ pageSize: 3 }}
        renderItem={(item, index) => (
          <List.Item
            key={item.key}
            actions={[
              <p
                onClick={() => {
                  onDelete(item.key, index);
                  //console.log(item.key);
                }}
              >
                delete
              </p>,
            ]}
          >
            {item.content}
          </List.Item>
        )}
      />
      <Button onClick={() => onReset()}>초기화</Button>
    </div>
  );
};
export default DataList;
