import React from "react";

const FormatDate = ({ dateString }) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return <span>{date.toLocaleDateString("vi-VN")}</span>;  // Định dạng ngày theo kiểu Việt Nam
};

export default FormatDate;
