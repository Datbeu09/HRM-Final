import React, { useMemo } from "react";
import InfoRow from "./InfoRow";

const formatDate = (val) => {
  if (!val) return "N/A";
  // Nếu là ISO: 2026-01-21T15:43:53.000Z => lấy phần YYYY-MM-DD
  if (typeof val === "string" && val.includes("T")) return val.split("T")[0];
  return val;
};

const calculateDays = (start, end) => {
  if (!start || !end) return "?";
  const s = new Date(start);
  const e = new Date(end);
  const diffTime = e - s;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : "?";
};

const getStatusUI = (status) => {
  switch (status) {
    case "PENDING":
      return { label: "PENDING", cls: "bg-amber-100 text-amber-700" };
    case "APPROVED":
      return { label: "APPROVED", cls: "bg-green-100 text-green-700" };
    case "REJECTED":
      return { label: "REJECTED", cls: "bg-red-100 text-red-700" };
    default:
      return { label: status || "N/A", cls: "bg-gray-100 text-gray-700" };
  }
};

export default function RequestCard({ request }) {
  const status = request?.status;
  const statusUI = useMemo(() => getStatusUI(status), [status]);

  const start = formatDate(request?.startDate);
  const end = formatDate(request?.endDate);

  // createdAt ưu tiên, fallback created_at
  const createdRaw = request?.createdAt || request?.created_at;
  const created = formatDate(createdRaw);

  const days = calculateDays(request?.startDate, request?.endDate);

  return (
    <div className="border border-border rounded-xl p-4 bg-white space-y-3 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center gap-3">
        <span className="font-semibold text-sm sm:text-base truncate">
          {request?.type || "N/A"}
        </span>

        <span className={`px-2 py-1 rounded-full text-xs font-bold shrink-0 ${statusUI.cls}`}>
          {statusUI.label}
        </span>
      </div>

      {/* Details */}
      <InfoRow label="Thời gian" value={`${start} → ${end}`} />
      <InfoRow label="Số ngày" value={days} />
      <InfoRow label="Ngày gửi" value={created} />

      {/* Reason */}
      <div>
        <p className="text-textMuted font-medium mb-1">Lý do</p>
        <div className="bg-gray-50 p-2 rounded text-sm">{request?.reason || "N/A"}</div>
      </div>

      {/* History */}
      {Array.isArray(request?.history) && request.history.length > 0 && (
        <div>
          <p className="text-textMuted font-medium mb-1">Lịch sử</p>
          <ul className="text-xs text-gray-600 space-y-1 max-h-20 overflow-y-auto">
            {request.history.map((item, index) => (
              <li key={index}>
                <span className="font-medium">{item?.time || "N/A"}:</span>{" "}
                {item?.text || ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
