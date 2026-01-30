import axiosClient from "./axiosClient";

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
