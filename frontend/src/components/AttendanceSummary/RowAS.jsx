import React from "react";
import { useNavigate } from "react-router-dom";

export default function RowAS({ id, name, code, standard, actual }) {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/attendance/${id}`);
  };

  return (
    <tr className="border-b last:border-b-0 hover:bg-slate-50 transition">
      <td className="px-6 py-4">
        <div className="font-medium">{name}</div>
        <div className="text-xs text-gray-500">{code}</div>
      </td>

      <td className="px-6 py-4 text-center">{standard}</td>

      <td className="px-6 py-4 text-center font-semibold">{actual}</td>

      {/* ✅ THAO TÁC */}
      <td className="px-6 py-4 text-right">
        <button
          onClick={handleViewDetail}
          className="
            px-3 py-1.5
            text-sm font-medium
            text-teal-600
            hover:text-teal-700
            hover:underline
          "
        >
          Chi tiết
        </button>
      </td>
    </tr>
  );
}
