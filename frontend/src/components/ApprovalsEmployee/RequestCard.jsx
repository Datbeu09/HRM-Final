import React, { useMemo, useState } from "react";

const formatDate = (val) => {
  if (!val) return "N/A";
  if (typeof val === "string" && val.includes("T")) return val.split("T")[0];
  return val;
};

const formatDateTimeVI = (iso) => {
  if (!iso) return "N/A";
  try {
    return new Date(iso).toLocaleString("vi-VN");
  } catch {
    return iso;
  }
};

const calculateDays = (start, end) => {
  if (!start || !end) return "?";
  const s = new Date(start);
  const e = new Date(end);
  const diffDays = Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : "?";
};

const normalizeStatusVN = (status) => {
  if (!status) return "N/A";
  const s = String(status);
  if (s === "Pending" || s === "PENDING" || s === "Chờ duyệt") return "Chờ duyệt";
  if (s === "Approved" || s === "APPROVED" || s === "Đã duyệt") return "Đã duyệt";
  if (s === "Rejected" || s === "REJECTED" || s === "Từ chối") return "Từ chối";
  return s;
};

const statusPill = (statusVN) => {
  switch (statusVN) {
    case "Chờ duyệt":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200/70";
    case "Đã duyệt":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70";
    case "Từ chối":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-200/70";
    default:
      return "bg-slate-50 text-slate-700 ring-1 ring-slate-200/70";
  }
};

const actionLabelVI = (action) => {
  switch (action) {
    case "CREATE":
      return "Tạo đơn";
    case "APPROVE":
      return "Phê duyệt";
    case "REJECT":
      return "Từ chối";
    case "UPDATE":
      return "Cập nhật";
    default:
      return action || "N/A";
  }
};

const Field = ({ label, value }) => (
  <div className="min-w-0">
    <p className="text-[11px] text-slate-500">{label}</p>
    <p className="text-sm font-semibold text-slate-900 truncate">{value}</p>
  </div>
);

export default function RequestCard({ request, statusLabel }) {
  const [open, setOpen] = useState(false);
  if (!request) return null;

  const start = formatDate(request?.startDate);
  const end = formatDate(request?.endDate);
  const days = calculateDays(request?.startDate, request?.endDate);
  const created = formatDate(request?.createdAt || request?.created_at);

  const statusVN = useMemo(
    () => normalizeStatusVN(statusLabel || request?.status),
    [statusLabel, request?.status]
  );

  const historyArr = Array.isArray(request?.history) ? request.history : [];
  const historyCount = historyArr.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
      {/* HEADER gọn + click để mở/đóng */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left"
      >
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">
            {request?.type || "N/A"}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {start} → {end} • {days} ngày
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusPill(statusVN)}`}>
            {statusVN}
          </span>
          <span className="text-slate-400 text-sm">{open ? "▴" : "▾"}</span>
        </div>
      </button>

      {/* BODY (ẩn/hiện) */}
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ngày gửi" value={created} />
            <Field label="Lịch sử" value={historyCount ? `${historyCount} lần` : "N/A"} />
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] font-semibold text-slate-500 mb-1">Lý do</p>
            <div className="max-h-20 overflow-y-auto pr-1 mini-scroll">
              <p className="text-sm text-slate-700 break-words">
                {request?.reason || "N/A"}
              </p>
            </div>
          </div>

          {historyCount > 0 && (
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[11px] font-semibold text-slate-500 mb-2">Lịch sử</p>

              <div className="max-h-28 overflow-y-auto pr-1 mini-scroll">
                <ul className="text-xs text-slate-600 space-y-2">
                  {historyArr.map((h, idx) => (
                    <li key={idx} className="flex items-start justify-between gap-3">
                      <span className="text-slate-500 whitespace-nowrap">
                        {formatDateTimeVI(h?.at || h?.time)}
                      </span>

                      <span className="font-medium text-slate-800 text-right">
                        {(() => {
                          const actionVI = actionLabelVI(h?.action);
                          const note = (h?.note || "").trim();

                          // Nếu note rỗng hoặc note giống actionVI => không in note nữa
                          const showNote = note && note.toLowerCase() !== actionVI.toLowerCase();

                          return (
                            <>
                              {actionVI}
                              {showNote ? ` — ${note}` : ""}
                            </>
                          );
                        })()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}