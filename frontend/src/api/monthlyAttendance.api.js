// src/api/monthlyAttendance.api.js
import axiosClient from "./axiosClient";

/**
 * Lấy toàn bộ chấm công tháng (Admin/Accountant view)
 * Backend nên trả: { success: true, data: [...] }
 */
export const getAllMonthlyAttendance = async () => {
  const res = await axiosClient.get("/monthlyAttendance");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

/**
 * Lấy chấm công theo nhân viên + tháng + năm
 */
export const getMonthlyAttendanceByEmployeeMonth = async ({
  employeeId,
  month,
  year,
}) => {
  const res = await axiosClient.get("/monthlyAttendance/by-employee-month", {
    params: { employeeId, month, year },
  });
  return res.data?.data || null;
};

/**
 * Tạo bản ghi chấm công tháng nếu chưa có
 */
export const createMonthlyAttendanceIfMissing = async ({
  employeeId,
  month,
  year,
}) => {
  const res = await axiosClient.post("/monthlyAttendance/ensure", {
    employeeId,
    month,
    year,
  });
  return res.data?.data || null;
};

/**
 * Submit chấm công tháng
 */
export const submitMonthlyAttendance = async ({ id }) => {
  const res = await axiosClient.post(`/monthlyAttendance/${id}/submit`);
  return res.data?.data || null;
};

/**
 * Approve chấm công tháng
 */
export const approveMonthlyAttendance = async ({ id }) => {
  const res = await axiosClient.post(`/monthlyAttendance/${id}/approve`);
  return res.data?.data || null;
};

/**
 * Reject chấm công tháng
 */
export const rejectMonthlyAttendance = async ({ id, rejectReason }) => {
  const res = await axiosClient.post(`/monthlyAttendance/${id}/reject`, {
    rejectReason,
  });
  return res.data?.data || null;
};

/**
 * Lock/Unlock chấm công tháng
 */
export const lockMonthlyAttendance = async ({ id, locked = true }) => {
  const res = await axiosClient.patch(`/monthlyAttendance/${id}/lock`, {
    locked,
  });
  return res.data?.data || null;
};
export const getMonthlyAttendanceById = async (id) => {
  const arr = await getAllMonthlyAttendance();
  const found = (Array.isArray(arr) ? arr : []).find((x) => String(x.id) === String(id));
  return found || null;
};
