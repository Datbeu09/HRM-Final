import React, { useMemo } from "react";

const formatDate = (val) => {
  if (!val) return "N/A";
  if (typeof val === "string" && val.includes("T")) return val.split("T")[0];
  return val;
};

const calcDays = (start, end) => {
  if (!start || !end) return "?";
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : "?";
};

// ✅ Chuẩn hoá status để FE luôn hiểu đúng
const normalizeStatus = (s) => {
  if (!s) return "";
  // English -> VN
  if (s === "Pending") return "Chờ duyệt";
  if (s === "Approved") return "Đã duyệt";
  if (s === "Rejected") return "Từ chối";
  // VN giữ nguyên
  return s;
};

const statusPill = (statusVN) => {
  switch (statusVN) {
    case "Chờ duyệt":
      return { label: "Chờ duyệt", cls: "bg-amber-100 text-amber-700" };
    case "Đã duyệt":
      return { label: "Đã duyệt", cls: "bg-green-100 text-green-700" };
    case "Từ chối":
      return { label: "Từ chối", cls: "bg-red-100 text-red-700" };
    default:
      return { label: statusVN || "N/A", cls: "bg-gray-100 text-gray-700" };
  }
};

const typeColors = {
  "Nghỉ phép": "bg-teal-100 text-teal-800",
  "Đi muộn": "bg-amber-100 text-amber-800",
  "Về sớm": "bg-orange-100 text-orange-800",
  "Công tác": "bg-blue-100 text-blue-800",
  "Làm thêm giờ": "bg-purple-100 text-purple-800",
  default: "bg-gray-100 text-gray-600",
};

export default function ApprovalsRequestCard({
  request,
  employee,
  onClick,
  onApprove,
  onReject,
}) {
  if (!request) return null;

  const { id, employeeId, type, reason, startDate, endDate, status } = request;

  // ✅ status chuẩn hoá về VN để check + hiển thị đồng nhất
  const statusVN = normalizeStatus(status);

  const duration = useMemo(() => {
    const days = calcDays(startDate, endDate);
    return `${formatDate(startDate)} → ${formatDate(endDate)} • ${days} ngày`;
  }, [startDate, endDate]);

  const s = statusPill(statusVN);

  // ✅ CHỈ cho action khi CHỜ DUYỆT
  const canAction = statusVN === "Chờ duyệt";

  const empName = employee?.name || `Employee #${employeeId ?? "N/A"}`;
  const empDept = employee?.department || "";

  return (
    <div
      className="
        flex flex-col md:flex-row gap-4 p-5 rounded-xl
        border border-slate-200 bg-white shadow-sm
        hover:border-teal-400 hover:shadow-md transition-all duration-200 cursor-pointer
      "
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 text-lg truncate">{empName}</h3>
            <p className="text-xs text-slate-500 truncate">
              {empDept ? `${empDept} • ` : ""}
              {duration}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
              typeColors[type] || typeColors.default
            }`}
          >
            {type || "N/A"}
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{reason || "N/A"}</p>

        <div className="mt-3">
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${s.cls}`}>
            {s.label}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-2 md:mt-0 items-center">
        <button
          className={`h-9 px-4 rounded-lg font-semibold transition
            ${canAction ? "bg-teal-600 text-white hover:bg-teal-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
          onClick={(e) => {
            e.stopPropagation();
            onApprove?.(id);
          }}
          disabled={!canAction}
          type="button"
        >
          Duyệt
        </button>

        <button
          className={`h-9 px-4 rounded-lg border font-semibold transition
            ${canAction ? "border-red-500 text-red-600 hover:bg-red-50" : "border-slate-200 text-slate-400 cursor-not-allowed"}`}
          onClick={(e) => {
            e.stopPropagation();
            onReject?.(id);
          }}
          disabled={!canAction}
          type="button"
        >
          Từ chối
        </button>
      </div>
    </div>
  );
}
