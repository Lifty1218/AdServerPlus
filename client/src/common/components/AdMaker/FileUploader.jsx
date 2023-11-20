import React from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

const FileUploader = ({ onFileUpload }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`file-uploader ${isDragActive ? "active" : ""}`}
    >
      <input {...getInputProps()} />
      <p>Drag and drop an image file here, or click to browse.</p>
      <span style={{ fontSize: "3.2rem", marginTop: "1rem", color: "#888" }}>
        <FiUpload />
      </span>
    </div>
  );
};

export default FileUploader;
