import React, { useEffect, useMemo, useState } from "react";
import { getAllTasks } from "../../api/tasks.api";
import TaskStats from "../../components/Assignment/User/TaskStats";
import TaskList from "../../components/Assignment/User/TaskList";


// ===== localStorage keys (FE status) =====
const LS_INPROGRESS = "tasks_inprogress_ids";
const LS_DONE = "tasks_done_ids";

const readIds = (key) => {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(raw) ? raw.map(Number).filter(Boolean) : [];
  } catch {
    return [];
  }
};

const writeIds = (key, ids) => {
  localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids.map(Number)))));
};

export default function AssignmentsUser() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [inProgressIds, setInProgressIds] = useState(() => readIds(LS_INPROGRESS));
  const [doneIds, setDoneIds] = useState(() => readIds(LS_DONE));

  // ===== Fetch tasks from BE =====
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const result = await getAllTasks({ page: 1, limit: 100, sortBy: "id", sortDir: "DESC" });
        const data = Array.isArray(result?.data) ? result.data : [];
        setTasks(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // persist to localStorage
  useEffect(() => writeIds(LS_INPROGRESS, inProgressIds), [inProgressIds]);
  useEffect(() => writeIds(LS_DONE, doneIds), [doneIds]);

  // ===== status helpers =====
  const getStatus = (taskId) => {
    const id = Number(taskId);
    if (doneIds.includes(id)) return "done";
    if (inProgressIds.includes(id)) return "inprogress";
    return "pending";
  };

  const onReceive = (taskId) => {
    const id = Number(taskId);
    if (!id) return;
    if (doneIds.includes(id)) return;
    if (!inProgressIds.includes(id)) setInProgressIds((prev) => [...prev, id]);
  };

  const onDone = (taskId) => {
    const id = Number(taskId);
    if (!id) return;
    if (!doneIds.includes(id)) setDoneIds((prev) => [...prev, id]);
    setInProgressIds((prev) => prev.filter((x) => x !== id));
  };

  // ===== Stats =====
  const stats = useMemo(() => {
    let pending = 0, inProgress = 0, done = 0;
    for (const t of tasks) {
      const st = getStatus(t.id);
      if (st === "pending") pending++;
      else if (st === "inprogress") inProgress++;
      else done++;
    }
    return { pending, inProgress, done };
  }, [tasks, inProgressIds, doneIds]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Đang tải danh sách công việc...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen overflow-hidden font-sans">
      <div className="flex h-full overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
            <div className="max-w-7xl mx-auto space-y-6">

              <TaskStats stats={stats} />

              <TaskList
                tasks={tasks}
                getStatus={getStatus}
                onReceive={onReceive}
                onDone={onDone}
              />

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
