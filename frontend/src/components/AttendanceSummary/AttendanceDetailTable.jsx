import React, { useMemo } from "react";
import Legend from "./Legend";
import ATDStatusBadge from "./ATDStatusBadge";

const fmtTime = (dt) => {
  if (!dt) return "--";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return "--";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const fmtMinutes = (mins) => {
  const m = Number(mins || 0);
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${hh}h ${String(mm).padStart(2, "0")}m`;
};

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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white">
          Danh sách chấm công chi tiết
        </h3>
        <Legend />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/40 text-[11px] uppercase font-bold tracking-wider text-slate-400">
              <th className="px-5 py-3 text-left">Ngày</th>
              <th className="px-5 py-3 text-left">Thứ</th>
              <th className="px-5 py-3 text-left">Giờ vào</th>
              <th className="px-5 py-3 text-left">Giờ ra</th>
              <th className="px-5 py-3 text-left">Tổng giờ</th>
              <th className="px-5 py-3 text-left">Trạng thái</th>
              <th className="px-5 py-3 text-right">Ghi chú</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                  Đang tải...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const checkIn = fmtTime(r.checkInAt);
                const checkOut = fmtTime(r.checkOutAt);

                // 🔥 FIX QUAN TRỌNG Ở ĐÂY
                const workedMinutes = Number(r.hoursWorked || 0) * 60;
                const totalLabel = fmtMinutes(workedMinutes);

                return (
                  <tr
                    key={r.dateStr}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-5 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      {r.dateLabel}
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                      {r.weekday}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-200">
                      {checkIn}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-200">
                      {checkOut}
                    </td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-200">
                      {totalLabel}
                    </td>

                    <td className="px-5 py-3">
                      <ATDStatusBadge status={r.status} />
                    </td>

                    <td className="px-5 py-3 text-right">
                      {r.id ? (
                        <button
                          onClick={() => onEditNote(r.id, r.notes)}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 italic"
                          title="Chỉnh sửa ghi chú"
                        >
                          {r.notes ? r.notes : "--"}
                        </button>
                      ) : (
                        <span className="text-slate-300 italic">--</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Hiển thị {shown}/{totalDays} ngày trong tháng{" "}
          {String(month || "").padStart(2, "0")}
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={page <= 1}
            className="w-7 h-7 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 grid place-items-center disabled:opacity-40 hover:bg-slate-50"
          >
            <span className="material-icons-round text-[18px] text-slate-500">
              chevron_left
            </span>
          </button>

          {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
            const p = i + 1;
            const active = p === page;
            return (
              <button
                key={p}
                onClick={() => onPage(p)}
                className={[
                  "w-7 h-7 rounded-md border text-xs font-semibold",
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-50",
                ].join(" ")}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={onNext}
            disabled={page >= totalPages}
            className="w-7 h-7 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 grid place-items-center disabled:opacity-40 hover:bg-slate-50"
          >
            <span className="material-icons-round text-[18px] text-slate-500">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
