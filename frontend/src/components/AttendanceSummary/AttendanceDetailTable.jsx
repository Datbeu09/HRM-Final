import React, { useMemo } from "react";
import Legend from "./Legend";
import ATDStatusBadge from "./ATDStatusBadge";

const fmtTime = (dt) => {
  if (!dt) return "--";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return "--";
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
};

const fmtMinutes = (mins) => {
  const m = Number(mins || 0);
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${hh}h ${String(mm).padStart(2, "0")}m`;
};

// ✅ suy kind từ status tiếng Việt/Anh (không fix cứng DB)
function inferKindFromStatus(status) {
  const s = String(status || "").toLowerCase();

  if (
    s.includes("cuối tuần") ||
    s.includes("weekend") ||
    s.includes("chủ nhật") ||
    s.includes("thứ bảy")
  ) {
    return "WEEKEND";
  }

  if (s.includes("nghỉ phép") || s.includes("leave")) {
    return "LEAVE";
  }

  return "WORK";
}

// ✅ nếu status trống, suy status hiển thị theo phút + kind
function inferDisplayStatus(status, workedMinutes, kind) {
  const raw = String(status || "").trim();
  if (raw) return raw;

  if (kind === "LEAVE") return "Nghỉ phép";
  if (kind === "WEEKEND") return "Cuối tuần";

  const m = Number(workedMinutes || 0);
  if (m >= 480) return "Có công";
  if (m >= 240) return "Thiếu công";
  return "Không công";
}

export default function AttendanceDetailTable({
  loading,
  rows,
  month,
  page,
  totalPages,
  pageSize,
  totalDays,
  onPrev,
  onNext,
  onPage,
  onEditNote,
}) {
  const shown = useMemo(
    () => Math.min(totalDays, page * pageSize),
    [totalDays, page, pageSize]
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Danh sách chấm công chi tiết
        </h3>
        <Legend />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-bold text-slate-400">
              <th className="px-6 py-3 text-left">Ngày</th>
              <th className="px-6 py-3 text-left">Thứ</th>
              <th className="px-6 py-3 text-left">Giờ vào</th>
              <th className="px-6 py-3 text-left">Giờ ra</th>
              <th className="px-6 py-3 text-left">Tổng giờ</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-right">Ghi chú</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                  Đang tải...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                // ✅ DB của bạn: hoursWorked là GIỜ (7.00, 8.00, 12.00...) → đổi sang phút
                const workedMinutes = Math.round(Number(r.hoursWorked || 0) * 60);

                // ✅ suy kind từ status
                const kind = inferKindFromStatus(r.status);

                // ✅ status hiển thị (ưu tiên DB; nếu trống thì suy theo phút)
                const displayStatus = inferDisplayStatus(
                  r.status,
                  workedMinutes,
                  kind
                );

                return (
                  <tr
                    key={r.dateStr || r.date || r.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-3 font-semibold">{r.dateLabel}</td>

                    <td className="px-6 py-3 text-slate-500">{r.weekday}</td>

                    <td className="px-6 py-3 font-medium">{fmtTime(r.checkInAt)}</td>

                    <td className="px-6 py-3 font-medium">{fmtTime(r.checkOutAt)}</td>

                    <td className="px-6 py-3">{fmtMinutes(workedMinutes)}</td>

                    <td className="px-6 py-3">
                      {/* ✅ badge tự bắt theo status tiếng Việt + fallback kind */}
                      <ATDStatusBadge kind={kind} status={displayStatus} />
                    </td>

                    <td className="px-6 py-3 text-right">
                      {r.id ? (
                        <button
                          onClick={() => onEditNote(r.id, r.notes)}
                          className="italic text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 truncate max-w-[240px]"
                          title="Chỉnh sửa ghi chú"
                        >
                          {r.notes || "--"}
                        </button>
                      ) : (
                        <span className="italic text-slate-300">--</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Hiển thị {shown}/{totalDays} ngày – tháng{" "}
          {String(month || "").padStart(2, "0")}
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={page <= 1}
            className="w-8 h-8 rounded-lg border disabled:opacity-40"
          >
            ‹
          </button>

          {Array.from({ length: totalPages })
            .slice(0, 5)
            .map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => onPage(p)}
                  className={`w-8 h-8 rounded-lg border text-xs font-semibold ${
                    p === page
                      ? "bg-primary text-white border-primary"
                      : "bg-white dark:bg-slate-900"
                  }`}
                >
                  {p}
                </button>
              );
            })}

          <button
            onClick={onNext}
            disabled={page >= totalPages}
            className="w-8 h-8 rounded-lg border disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}