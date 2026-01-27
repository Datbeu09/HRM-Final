import React, { useState } from "react";

export default function InsuranceFilter({ data, onFilter, onReset }) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    const result = data.filter(e =>
      e.employeeCode.toLowerCase().includes(keyword.toLowerCase()) ||
      e.name.toLowerCase().includes(keyword.toLowerCase())
    );
    onFilter(result);
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <input
        className="px-4 py-2.5 border rounded-xl text-sm"
        placeholder="Mã NV hoặc Họ tên..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      <select className="px-4 py-2.5 border rounded-xl text-sm">
        <option>Tất cả bảo hiểm</option>
        <option>BHXH</option>
        <option>BHYT</option>
        <option>BHTN</option>
      </select>

      <button
        onClick={handleSearch}
        className="bg-primarySoft text-primary rounded-xl font-bold"
      >
        Lọc
      </button>

      <button
        onClick={onReset}
        className="border rounded-xl text-sm font-bold"
      >
        Làm mới
      </button>
    </div>
  );
}
