import React, { useMemo } from "react";

function StatCard({ icon, iconBg, iconColor, title, value }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm px-5 py-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl grid place-items-center ${iconBg}`}>
        <span className={`material-icons-round text-[20px] ${iconColor}`}>
          {icon}
        </span>
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          {title}
        </p>
        <p className="text-[22px] font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

// format hiển thị
const formatUnit = (v) => {
  const n = Number(v);
  if (Number.isInteger(n)) return n;
  return n.toFixed(2).replace(/\.?0+$/, "");
};

// suy kind từ status tiếng Việt
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

// ✅ lấy workedMinutes linh hoạt: ưu tiên workedMinutes, fallback hoursWorked
function getWorkedMinutes(d) {
  if (d?.workedMinutes != null) return Number(d.workedMinutes || 0);
  if (d?.hoursWorked != null) return Number(d.hoursWorked || 0) * 60;
  return 0;
}

export default function SummaryCards({ days = [] }) {
  const { workDays, absentDays, leaveDays, otUnits } = useMemo(() => {
    let workDays = 0;
    let absentDays = 0;
    let leaveDays = 0;
    let otUnits = 0;

    days.forEach((d) => {
      const kind = d.kind || inferKindFromStatus(d.status);

      // Nghỉ phép
      if (kind === "LEAVE") {
        leaveDays++;
        return;
      }

      const minutes = getWorkedMinutes(d);
      const hours = minutes / 60;

      // OT (áp dụng cả ngày thường & cuối tuần)
      if (hours > 8) {
        const otHours = hours - 8;
        otUnits += (otHours / 8) * 1.5;
      }

      // Cuối tuần → không tính công chuẩn
      if (kind === "WEEKEND") return;

      // ✅ Rule mới:
      // - 8h = 1 công
      // - 4h = 0.5 công (thiếu công)
      // - 2 thiếu công tự nhiên = 1 công (vì 0.5 + 0.5 = 1) => KHÔNG cần gộp gì thêm
      if (minutes >= 480) {
        workDays += 1;
      } else if (minutes >= 240) {
        workDays += 0.5; // 1 thiếu công = 0.5 công
      } else {
        absentDays += 1; // không công
      }
    });

    return { workDays, absentDays, leaveDays, otUnits };
  }, [days]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        icon="check_circle"
        iconBg="bg-teal-50 dark:bg-teal-900/20"
        iconColor="text-teal-600 dark:text-teal-400"
        title="Tổng công"
        value={formatUnit(workDays)}
      />
      <StatCard
        icon="cancel"
        iconBg="bg-rose-50 dark:bg-rose-900/20"
        iconColor="text-rose-600 dark:text-rose-400"
        title="Không công"
        value={absentDays}
      />
      <StatCard
        icon="event_note"
        iconBg="bg-amber-50 dark:bg-amber-900/20"
        iconColor="text-amber-600 dark:text-amber-400"
        title="Nghỉ phép"
        value={leaveDays}
      />
      <StatCard
        icon="schedule"
        iconBg="bg-indigo-50 dark:bg-indigo-900/20"
        iconColor="text-indigo-600 dark:text-indigo-400"
        title="Công OT"
        value={formatUnit(otUnits)}
      />
    </div>
  );
}