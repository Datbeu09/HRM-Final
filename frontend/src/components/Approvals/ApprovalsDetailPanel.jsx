import React, { useMemo, useState } from "react";

const formatDate = (val) => {
  if (!val) return "N/A";
  if (typeof val === "string" && val.includes("T")) return val.split("T")[0];
  return val;
};

const formatDateTime = (val) => {
  if (!val) return "N/A";
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return String(val);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  } catch {
    return String(val);
  }
};

const calcDays = (start, end) => {
  if (!start || !end) return "?";
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : "?";
};

// ✅ normalize status về VN để check nhất quán
const normalizeStatusVN = (s) => {
  if (!s) return "";
  if (s === "Pending") return "Chờ duyệt";
  if (s === "Approved") return "Đã duyệt";
  if (s === "Rejected") return "Từ chối";
  return s; // đã là VN thì giữ nguyên
};

const statusMeta = (statusVN) => {
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

const actionLabel = (action) => {
  switch (action) {
    case "CREATE":
      return "Tạo đơn";
    case "UPDATE":
      return "Cập nhật";
    case "APPROVE":
      return "Duyệt";
    case "REJECT":
      return "Từ chối";
    default:
      return action || "N/A";
  }
};

export default function ApprovalsDetailPanel({
  request,
  employee,
  onClose,
  onApprove,
  onReject,
  onDelete,
}) {
  // ✅ Hook luôn chạy, không được đặt sau return sớm
  const [note, setNote] = useState("");

  // ✅ luôn có safe object để hooks dùng ổn định
  const safe = request ?? {};
  const {
    id,
    employeeId,
    type,
    startDate,
    endDate,
    reason,
    status,
    history,
    createdAt,
    created_at,
  } = safe;

  const statusVN = normalizeStatusVN(status);
  const s = statusMeta(statusVN);
  const canAction = statusVN === "Chờ duyệt";

  const duration = useMemo(() => `${calcDays(startDate, endDate)} ngày`, [startDate, endDate]);
  const created = useMemo(() => formatDate(createdAt || created_at), [createdAt, created_at]);

  const empName = employee?.name || `Employee #${employeeId ?? "N/A"}`;
  const empDept = employee?.department || "";
  const empCode = employee?.employeeCode || "";

  const histArr = Array.isArray(history) ? history : [];

  // ✅ return sớm đặt SAU hooks
  if (!request) return null;

  const handleRejectClick = () => {
    onReject?.(id, note?.trim() || "");
    setNote("");
  };

  const handleApproveClick = () => {
    onApprove?.(id, note?.trim() || "");
    setNote("");
  };

  const handleDeleteClick = () => {
    onDelete?.(id);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <aside className="fixed top-0 right-0 z-50 h-full w-[400px] bg-white border-l border-slate-200 shadow-xl flex flex-col">
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base">Chi tiết yêu cầu</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.cls}`}>
              {s.label}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-teal-600 transition">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <p className="font-bold text-slate-900">{empName}</p>
            <p className="text-xs text-slate-500">
              {empDept || "N/A"} {empCode ? `• ${empCode}` : ""}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500">
              <p>
                Employee ID:{" "}
                <span className="font-medium text-slate-700">{employeeId ?? "N/A"}</span>
              </p>
              <p>
                Request ID:{" "}
                <span className="font-medium text-slate-700">{id ?? "N/A"}</span>
              </p>
              <p className="col-span-2">
                Ngày gửi: <span className="font-medium text-slate-700">{created}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 px-3 py-2 border border-slate-100">
              <p className="text-xs text-slate-500">Loại yêu cầu</p>
              <p className="font-bold text-slate-900">{type || "N/A"}</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2 border border-slate-100">
              <p className="text-xs text-slate-500">Thời gian</p>
              <p className="font-bold text-slate-900">{duration}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900">Thông tin chi tiết</h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="text-slate-500">Bắt đầu</p>
                <p className="font-medium text-slate-900">{formatDate(startDate)}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="text-slate-500">Kết thúc</p>
                <p className="font-medium text-slate-900">{formatDate(endDate)}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 text-xs border border-slate-100">
              <p className="text-slate-500 mb-1">Lý do</p>
              <p className="text-slate-700">{reason || "N/A"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Lịch sử</h4>

            {histArr.length > 0 ? (
              <div className="space-y-3">
                {histArr.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-2 h-2 mt-1.5 rounded-full bg-teal-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700">
                        {formatDateTime(item?.at)} • {actionLabel(item?.action)}
                      </p>
                      <p className="text-xs text-slate-500">
                        by: <span className="font-medium">{item?.by ?? "N/A"}</span>
                      </p>
                      {item?.note ? (
                        <p className="text-xs text-slate-600 mt-1 break-words">
                          Ghi chú: {item.note}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Chưa có lịch sử.</p>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 space-y-3">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú (tuỳ chọn)..."
            className="w-full h-10 px-3 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/30"
            disabled={!canAction}
          />

          <div className="flex gap-3">
            {onDelete && (
              <button
                className="h-10 px-4 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold"
                onClick={handleDeleteClick}
                type="button"
              >
                Xoá
              </button>
            )}

            <button
              className={`flex-1 h-10 rounded-lg border font-bold transition
                ${
                  canAction
                    ? "border-red-500 text-red-600 hover:bg-red-50"
                    : "border-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              onClick={handleRejectClick}
              disabled={!canAction}
              type="button"
            >
              Từ chối
            </button>

            <button
              className={`flex-1 h-10 rounded-lg font-bold text-white transition
                ${
                  canAction
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              onClick={handleApproveClick}
              disabled={!canAction}
              type="button"
            >
              ✓ Duyệt
            </button>
          </div>

          {!canAction && (
            <p className="text-[11px] text-slate-400">
              Chỉ yêu cầu trạng thái <b>Chờ duyệt</b> mới có thể duyệt / từ chối.
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
