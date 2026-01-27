import React from "react";

export default function TaskStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">new_releases</span>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase">Công việc mới</p>
          <h3 className="text-2xl font-bold">{stats.pending}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">pending_actions</span>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase">Đang thực hiện</p>
          <h3 className="text-2xl font-bold">{stats.inProgress}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">check_circle</span>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase">Hoàn thành</p>
          <h3 className="text-2xl font-bold">{stats.done}</h3>
        </div>
      </div>
    </div>
  );
}
