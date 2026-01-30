// src/api/tasks.api.js
import axiosClient from "./axiosClient";

const unwrap = (res) => res?.data ?? res;

const normalizeTask = (t = {}) => ({
  id: t.id,
  taskCode: t.taskCode,
  taskName: t.taskName,
  description: t.description,
  created_at: t.created_at ?? t.createdAt ?? null,
  updated_at: t.updated_at ?? t.updatedAt ?? null,
});

// backend field: id, taskCode, taskName, description, created_at, updated_at
export const getAllTasks = async (params = {}) => {
  const res = await axiosClient.get("/tasks", { params });
  const root = unwrap(res);

  const raw = Array.isArray(root?.data)
    ? root.data
    : Array.isArray(root)
    ? root
    : [];

  // giữ thêm paging nếu bạn cần sau này
  const paging = root?.paging ?? null;

  return { data: raw.map(normalizeTask), paging };
};

// dùng cho popup (list nhanh)
export const getTasks = async () => {
  const { data } = await getAllTasks({
    page: 1,
    limit: 100,
    sortBy: "id",
    sortDir: "DESC",
  });
  return data;
};

export const getTaskById = async (id) => {
  const res = await axiosClient.get(`/tasks/${id}`);
  const root = unwrap(res);

  const raw = root?.data ?? root ?? null;
  return raw ? normalizeTask(raw) : null;
};
