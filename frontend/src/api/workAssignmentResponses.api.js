import axiosClient from "./axiosClient";

export const getWorkAssignmentResponses = async (params = {}) => {
  const res = await axiosClient.get("/work-assignment-responses", { params });
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const createWorkAssignmentResponse = async (payload) => {
  const res = await axiosClient.post("/work-assignment-responses", payload);
  return res.data?.data || null;
};
