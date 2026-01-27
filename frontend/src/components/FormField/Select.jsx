import React from "react";

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <select {...props} className="w-full mt-1 p-2 border rounded-lg">
      <option value="">-- Chọn --</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default Select;