import React from "react";

export default function TaskItem({ task, status, onReceive, onDone }) {
  const isDone = status === "done";
  const isDoing = status === "inprogress";
  const isPending = status === "pending";

  return (
    <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-slate-50">
      {/* Left */}
      <div className="space-y-1">
        <h5 className="font-bold text-lg">
          {task.taskName}
          {task.taskCode ? (
            <span className="ml-2 text-xs text-slate-500 font-semibold">
              ({task.taskCode})
            </span>
          ) : null}
        </h5>

        {task.description ? (
          <p className="text-sm text-slate-600">{task.description}</p>
        ) : (
          <p className="text-sm text-slate-400 italic">Không có mô tả</p>
        )}

        <div className="text-xs text-slate-500">
          Trạng thái:{" "}
          <span
            className={`font-extrabold ${
              isDone ? "text-emerald-600" : isDoing ? "text-amber-600" : "text-blue-600"
            }`}
          >
            {isDone ? "ĐÃ XONG" : isDoing ? "ĐANG LÀM" : "MỚI"}
          </span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 justify-end">
        {isPending && (
          <button
            className="px-5 py-2 text-sm font-bold rounded-lg bg-teal-600 text-white hover:bg-teal-700"
            onClick={onReceive}
          >
            NHẬN VIỆC
          </button>
        )}

        {isDoing && (
          <button
            className="px-5 py-2 text-sm font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={onDone}
          >
            HOÀN THÀNH
          </button>
        )}

        {isDone && (
          <button
            className="px-5 py-2 text-sm font-bold rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed"
            disabled
          >
            ĐÃ XONG
          </button>
        )}
      </div>
    </div>
  );
}
