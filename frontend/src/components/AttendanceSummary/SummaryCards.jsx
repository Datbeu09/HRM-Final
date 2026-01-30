import React from "react";

function StatCard({ icon, iconBg, iconColor, title, value }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm px-5 py-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl grid place-items-center ${iconBg}`}>
        <span className={`material-icons-round text-[20px] ${iconColor}`}>{icon}</span>
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

export default function SummaryCards({ present, absent, leave }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon="check_circle"
        iconBg="bg-teal-50 dark:bg-teal-900/20"
        iconColor="text-teal-600 dark:text-teal-400"
        title="Tổng ngày có công"
        value={present}
      />
      <StatCard
        icon="cancel"
        iconBg="bg-rose-50 dark:bg-rose-900/20"
        iconColor="text-rose-600 dark:text-rose-400"
        title="Tổng ngày không công"
        value={absent}
      />
      <StatCard
        icon="event_note"
        iconBg="bg-amber-50 dark:bg-amber-900/20"
        iconColor="text-amber-600 dark:text-amber-400"
        title="Ngày nghỉ phép"
        value={leave}
      />
    </div>
  );
}
