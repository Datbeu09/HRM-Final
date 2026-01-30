import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, getStatus, onReceive, onDone, onReject }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h4 className="font-bold">Danh sách công việc</h4>
        <span className="text-sm text-slate-500">Tổng: {tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          Chưa có công việc nào được giao cho bạn.
        </div>
      ) : (
        <div className="divide-y">
          {tasks.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              status={getStatus(t.id)}
              onReceive={() => onReceive(t.id)}
              onReject={() => onReject?.(t.id)}
              onDone={() => onDone(t.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
