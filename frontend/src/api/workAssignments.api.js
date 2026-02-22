import axiosClient from "./axiosClient";
import { toYMD } from "../utils/dateOnly";

// normalize date fields trước khi gửi lên backend (tránh Date -> ISO bị lệch)
const normalizeAssignmentPayload = (payload = {}) => {
  const p = { ...payload };

  // các field ngày thường gặp (tuỳ bạn đặt tên)
  if ("startDate" in p) p.startDate = toYMD(p.startDate) || p.startDate;
  if ("endDate" in p) p.endDate = toYMD(p.endDate) || p.endDate;
  if ("assignedDate" in p) p.assignedDate = toYMD(p.assignedDate) || p.assignedDate;
  if ("deadline" in p) p.deadline = toYMD(p.deadline) || p.deadline;

  return p;
};

export const getMyWorkAssignments = async () => {
  const res = await axiosClient.get("/workAssignments/me");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const updateMyWorkAssignmentStatus = async (id, payload) => {
  const res = await axiosClient.patch(
    `/workAssignments/${id}/my-status`,
    payload
  );
  return res.data?.data || null;
};

export const getAllWorkAssignments = async (params = {}) => {
  const res = await axiosClient.get("/workAssignments", { params });
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const createWorkAssignment = async (payload) => {
  const safePayload = normalizeAssignmentPayload(payload);
  const res = await axiosClient.post("/workAssignments", safePayload);
  return res.data?.data || null;
};

export const getWorkAssignmentById = async (id) => {
  const res = await axiosClient.get(`/workAssignments/${id}`);
  return res.data?.data || null;
};