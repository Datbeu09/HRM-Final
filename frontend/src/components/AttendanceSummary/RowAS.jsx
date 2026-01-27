import React from "react";
export default function RowAS({ name, code, actual, warning }) {
  return (
    <tr className={`border-t ${warning ? "bg-orange-50/40" : "hover:bg-gray-50"}`}>
      <td className="px-6 py-4">
        <div className="font-bold">{name}</div>
        <div className="text-xs text-gray-500">{code}</div>
      </td>
      <td className="px-6 py-4 text-center">22</td>
      <td
        className={`px-6 py-4 text-center font-bold ${
          warning ? "text-orange-600" : ""
        }`}
      >
        {actual}
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-gray-400 hover:text-primary">
          <span className="material-symbols-outlined text-[20px]">
            visibility
          </span>
        </button>
      </td>
    </tr>
  );
}
