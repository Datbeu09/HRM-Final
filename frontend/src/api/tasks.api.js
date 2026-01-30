import axiosClient from "./axiosClient";

export const getAllTasks = async (params = {}) => {
  const res = await axiosClient.get("/tasks", { params });
  // backend trả {success, data, paging}
  return res.data || { data: [], paging: null };
};

export const getTasks = async () => {
  const res = await axiosClient.get("/tasks", {
    params: { page: 1, limit: 100, sortBy: "id", sortDir: "DESC" },
  });
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const getTaskById = async (id) => {
  const res = await axiosClient.get(`/tasks/${id}`);
  return res.data?.data || null;
};
