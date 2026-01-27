import React from "react";

export default function ReportsSearchInput({ placeholder }) {
  return (
    <input
      placeholder={placeholder}
      className="hidden sm:block px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-primary outline-none"
    />
  );
}
