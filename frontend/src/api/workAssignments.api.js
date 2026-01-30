import axiosClient from "./axiosClient";

export const getMyWorkAssignments = async () => {
  const res = await axiosClient.get("/workAssignments/me");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

// ✅ employee update status của chính assignment mình (DONE / IN_PROGRESS)
export const updateMyWorkAssignmentStatus = async (id, payload) => {
  const res = await axiosClient.patch(`/workAssignments/${id}/my-status`, payload);
  return res.data?.data || null;
};

// Admin/HR vẫn dùng
export const getAllWorkAssignments = async (params = {}) => {
  const res = await axiosClient.get("/workAssignments", { params });
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const createWorkAssignment = async (payload) => {
  const res = await axiosClient.post("/workAssignments", payload);
  return res.data?.data || null;
};

export const getWorkAssignmentById = async (id) => {
  const res = await axiosClient.get(`/workAssignments/${id}`);
  return res.data?.data || null;
};
