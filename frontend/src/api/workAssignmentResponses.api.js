import axiosClient from "./axiosClient";

export const getWorkAssignmentResponses = async (params = {}) => {
  const res = await axiosClient.get("/work-assignment-responses", { params });
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const getMyWorkAssignmentResponses = async (params = {}) => {
  const res = await axiosClient.get("/work-assignment-responses/me", { params });
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const createMyWorkAssignmentResponse = async (payload) => {
  // payload: { workAssignmentId, status: "ACCEPTED"|"REJECTED", rejectReason? }
  const res = await axiosClient.post("/work-assignment-responses", payload);
  return res.data?.data || null;
};
