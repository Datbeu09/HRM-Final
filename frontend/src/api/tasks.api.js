// src/api/tasks.api.js
import axiosClient from "./axiosClient";

// helper unwrap
const unwrapList = (res) => {
  // BE: { success: true, data: [...], paging: {...} }
  if (Array.isArray(res?.data)) return res.data;
  return res?.data || [];
};

const unwrapOne = (res) => {
  // BE: { success: true, data: {...} }
  return res?.data || null;
};

/**
 * GET /tasks
 * params: { page, limit, sortBy, sortDir, search }
 * returns: { data: Task[], paging: {...} }
 */
export const getAllTasks = async (params = {}) => {
  try {
    const response = await axiosClient.get("/tasks", { params });
    return {
      data: unwrapList(response.data),
      paging: response.data?.paging || null,
    };
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return { data: [], paging: null };
  }
};

/**
 * GET /tasks/:id
 * returns: Task | null
 */
export const getTaskById = async (id) => {
  try {
    const response = await axiosClient.get(`/tasks/${id}`);
    return unwrapOne(response.data);
  } catch (error) {
    console.error("Failed to fetch task:", error);
    return null;
  }
};

/**
 * POST /tasks
 * body: { taskCode?, taskName, description? }
 * returns: created Task
 */
export const createTask = async (task) => {
  const response = await axiosClient.post("/tasks", task);
  return unwrapOne(response.data);
};

/**
 * PUT /tasks/:id
 * returns: updated Task
 */
export const updateTask = async (id, task) => {
  const response = await axiosClient.put(`/tasks/${id}`, task);
  return unwrapOne(response.data);
};

/**
 * DELETE /tasks/:id
 * returns: { success: true, message: "Deleted" } (tuỳ BE)
 */
export const deleteTask = async (id) => {
  const response = await axiosClient.delete(`/tasks/${id}`);
  return response.data;
};
