import React, { useMemo } from "react";

const badge = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "pending") return { text: "Chờ tiếp nhận", cls: "bg-blue-50 text-blue-700" };
  if (s === "inprogress") return { text: "Đang thực hiện", cls: "bg-amber-50 text-amber-700" };
  if (s === "done") return { text: "Hoàn thành", cls: "bg-emerald-50 text-emerald-700" };
  if (s === "rejected") return { text: "Đã từ chối", cls: "bg-red-50 text-red-700" };
  return { text: status || "N/A", cls: "bg-slate-50 text-slate-700" };
};

const fmt = (val) => {
  if (!val) return "";
  if (typeof val === "string" && val.includes("T")) return val.split("T")[0];
  return String(val);
};

export default function TaskItem({ task, status, onReceive, onDone, onReject }) {
  const b = useMemo(() => badge(status), [status]);

  const canReceive = status === "pending";
  const canDone = status === "inprogress";
  const canReject = status === "pending";

  return (
    <div className="px-6 py-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <p className="font-semibold truncate">{task?.title || "N/A"}</p>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${b.cls}`}>
            {b.text}
          </span>
        </div>

        <div className="text-xs text-slate-500 mt-1 space-x-3">
          {task?.departmentName ? <span>Phòng ban: {task.departmentName}</span> : null}
          {(task?.startDate || task?.endDate) ? (
            <span>
              Thời gian: {fmt(task?.startDate)} {task?.endDate ? `→ ${fmt(task.endDate)}` : ""}
            </span>
          ) : null}
        </div>

        {task?.description ? (
          <div className="mt-2 text-sm text-slate-700 bg-slate-50 border rounded-lg p-3">
            {task.description}
          </div>
        ) : null}

        {status === "rejected" && task?.rejectReason ? (
          <div className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
            Lý do từ chối: {task.rejectReason}
          </div>
        ) : null}
      </div>

      <div className="shrink-0 flex flex-col gap-2">
        <button
          disabled={!canReceive}
          onClick={onReceive}
          className={`px-4 py-2 rounded-lg text-sm font-semibold border
            ${canReceive ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"}`}
        >
          Tiếp nhận
        </button>

        <button
          disabled={!canReject}
          onClick={onReject}
          className={`px-4 py-2 rounded-lg text-sm font-semibold border
            ${canReject ? "bg-white text-red-600 border-red-200 hover:bg-red-50" : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"}`}
        >
          Từ chối
        </button>

        <button
          disabled={!canDone}
          onClick={onDone}
          className={`px-4 py-2 rounded-lg text-sm font-semibold border
            ${canDone ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700" : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"}`}
        >
          Hoàn thành
        </button>
      </div>
    </div>
  );
}
