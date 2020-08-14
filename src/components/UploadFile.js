import React from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

function UploadFile({ onUploaded }) {
  const props = {
    name: "file",
    multiple: true,
    action:
      "http://ec2-13-209-89-146.ap-northeast-2.compute.amazonaws.com:3000/kakao/daily/upload",
    showUploadList: false,
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        onUploaded();
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">클릭하거나 드래그하여 업로드</p>
      <p className="ant-upload-hint">파일명을 날짜순으로 정리해주세요</p>
    </Dragger>
  );
}

export default UploadFile;
