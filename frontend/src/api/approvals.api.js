// src/api/approvals.api.js
import axiosClient from "./axiosClient";

/* =========================
   STATUS CONSTANTS
========================= */

export const APPROVAL_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

/* =========================
   STATUS LABEL (VI)
========================= */

export const approvalStatusLabelVI = (status) => {
  if (!status) return "";

  switch (status) {
    case "Pending":
    case "Chờ duyệt":
      return "Chờ duyệt";

    case "Approved":
    case "Đã duyệt":
      return "Đã duyệt";

    case "Rejected":
    case "Từ chối":
      return "Từ chối";

    default:
      return status;
  }
};

/* =========================
   ADMIN APIs
========================= */

// Lấy tất cả approvals (Admin)
export const getApprovals = async () => {
  const res = await axiosClient.get("/approvals");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const approveApproval = async (id, payload = {}) => {
  const res = await axiosClient.patch(`/approvals/${id}/approve`, payload);
  return res.data?.data ?? res.data ?? {};
};

export const rejectApproval = async (id, payload = {}) => {
  const res = await axiosClient.patch(`/approvals/${id}/reject`, payload);
  return res.data?.data ?? res.data ?? {};
};

export const deleteApproval = async (id) => {
  const res = await axiosClient.delete(`/approvals/${id}`);
  return res.data?.data ?? res.data ?? {};
};

/* =========================
   EMPLOYEE APIs
========================= */

// Lấy approvals theo nhân viên
export const getApprovalsByEmployeeId = async (employeeId) => {
  try {
    const res = await axiosClient.get(`/approvals/employee/${employeeId}`);
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (err) {
    // ✅ nếu BE trả 404 (route chưa có / hoặc trả 404 khi không có data)
    if (err?.response?.status === 404) {
      // fallback: lấy tất cả approvals rồi filter theo employeeId
      const all = await getApprovals(); // đã chuẩn hoá trả []
      return all.filter((a) => String(a.employeeId) === String(employeeId));
    }
    throw err;
  }
};

// Tạo yêu cầu mới
export const createApproval = async (payload) => {
  const res = await axiosClient.post("/approvals", payload);
  return res.data?.data ?? res.data ?? {};
};

/* =========================
   Finance / LEAVE
========================= */

export const getApprovedLeavesByEmployeeMonth = async ({
  employeeId,
  month,
  year,
}) => {
  const res = await axiosClient.get("/approvals/leaves/approved", {
    params: { employeeId, month, year },
  });
  return Array.isArray(res.data?.data) ? res.data.data : [];
};
