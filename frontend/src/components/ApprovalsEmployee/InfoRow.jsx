import React from "react";

export default function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-textMuted">{label}</span>
      <span className="font-semibold text-gray-900 text-right">{value}</span>
    </div>
  );
}
