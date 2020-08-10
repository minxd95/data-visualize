import React from "react";
import { Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function UploadFile({ onUploaded }) {
  const props = {
    name: "file",
    action: "http://localhost:3000/kakao/daily/upload",
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
    <Upload {...props}>
      <Button>
        <UploadOutlined />
        Click to upload
      </Button>
    </Upload>
  );
}

export default UploadFile;
