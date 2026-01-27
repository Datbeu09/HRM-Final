// src/api/approvals.api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const unwrap = (res) => {
  if (res?.data?.success) return res.data.data;
  return res?.data;
};

export const APPROVAL_STATUS = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

export const approvalStatusLabelVI = (s) => s || "N/A";

// Admin: list all
export async function getApprovals(params = {}) {
  const res = await api.get("/approvals", { params });
  return unwrap(res);
}

// Employee: list own (BE sẽ ép theo role)
export async function getApprovalsByEmployeeId(employeeId) {
  const res = await api.get("/approvals", { params: { employeeId } });
  return unwrap(res);
}

export async function getApprovalById(id) {
  const res = await api.get(`/approvals/${id}`);
  return unwrap(res);
}

// ✅ CREATE: chỉ gửi đúng field cần thiết
export async function createApproval(payload) {
  const body = {
    employeeId: payload.employeeId,
    type: payload.type,
    reason: payload.reason,
    startDate: payload.startDate,
    endDate: payload.endDate,
  };
  const res = await api.post("/approvals", body);
  return unwrap(res);
}

export async function updateApproval(id, payload) {
  const res = await api.put(`/approvals/${id}`, payload);
  return unwrap(res);
}

export async function deleteApproval(id) {
  const res = await api.delete(`/approvals/${id}`);
  return unwrap(res);
}

export async function approveApproval(id, note = "") {
  const res = await api.post(`/approvals/${id}/approve`, note ? { note } : {});
  return unwrap(res);
}

export async function rejectApproval(id, note = "") {
  const res = await api.post(`/approvals/${id}/reject`, note ? { note } : {});
  return unwrap(res);
}
