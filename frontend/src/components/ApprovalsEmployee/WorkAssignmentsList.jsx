// src/components/ApprovalsEmployee/WorkAssignmentCard.jsx
import React, { useMemo } from "react";

const formatDate = (val) => {
  if (!val) return "N/A";
  if (typeof val === "string" && val.includes("T")) return val.split("T")[0];
  return val;
};

const getStatusUI = (status) => {
  const s = String(status || "").toUpperCase();

  switch (s) {
    case "PENDING":
    case "TODO":
      return { label: s, cls: "bg-amber-100 text-amber-700" };
    case "IN_PROGRESS":
    case "DOING":
      return { label: s, cls: "bg-blue-100 text-blue-700" };
    case "DONE":
    case "COMPLETED":
      return { label: s, cls: "bg-green-100 text-green-700" };
    case "REJECTED":
    case "CANCELED":
      return { label: s, cls: "bg-red-100 text-red-700" };
    default:
      return { label: s || "N/A", cls: "bg-gray-100 text-gray-700" };
  }
};

export default function WorkAssignmentCard({ item }) {
  const statusUI = useMemo(() => getStatusUI(item?.status), [item?.status]);

  const start = formatDate(item?.startDate);
  const end = formatDate(item?.endDate);

  return (
    <div className="border border-border rounded-xl p-4 bg-white space-y-3 shadow-sm">
      <div className="flex justify-between items-center gap-3">
        <span className="font-semibold text-sm sm:text-base truncate">
          {item?.title || "N/A"}
        </span>

        <span className={`px-2 py-1 rounded-full text-xs font-bold shrink-0 ${statusUI.cls}`}>
          {statusUI.label}
        </span>
      </div>

      {(start !== "N/A" || end !== "N/A") && (
        <div className="text-xs text-slate-600">
          <span className="font-medium">Thời gian:</span> {start} → {end}
        </div>
      )}

      {item?.departmentName ? (
        <div className="text-xs text-slate-500">
          <span className="font-medium">Phòng ban:</span> {item.departmentName}
        </div>
      ) : null}

      {item?.description ? (
        <div className="text-sm bg-gray-50 p-2 rounded">{item.description}</div>
      ) : null}
    </div>
  );
}
