import axiosClient from "./axiosClient";

// GET all -> trả về mảng
export const getAllWorkAssignments = async () => {
  const res = await axiosClient.get("/workAssignments");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

// GET by employeeId -> trả về mảng
export const getWorkAssignmentsByEmployeeId = async (employeeId) => {
  const res = await axiosClient.get(`/workAssignments/employee/${employeeId}`);
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

// GET by id -> trả về object (data) hoặc null
export const getWorkAssignmentById = async (id) => {
  const res = await axiosClient.get(`/workAssignments/${id}`);
  return res.data?.data || null;
};

export const addWorkAssignment = async (payload) => {
  const res = await axiosClient.post("/workAssignments", payload);
  return res.data; // {success, message, insertId}
};

export const updateWorkAssignment = async (id, payload) => {
  const res = await axiosClient.put(`/workAssignments/${id}`, payload);
  return res.data;
};

export const deleteWorkAssignment = async (id) => {
  const res = await axiosClient.delete(`/workAssignments/${id}`);
  return res.data;
};
