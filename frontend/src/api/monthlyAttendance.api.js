// src/api/monthlyAttendance.api.js
import axiosClient from "./axiosClient";

/**
 * Lưu ý response backend của bạn có thể là:
 * 1) { success:true, data:[...] }  (nếu bạn đã sửa theo mẫu mình gợi ý)
 * 2) [...]                        (nếu controller đang res.json(rows) kiểu cũ)
 * => Hàm normalizeData() sẽ tự xử lý cả 2
 */

const normalizeData = (res) => {
  const payload = res?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data; // phòng trường hợp bọc 2 lớp
  return [];
};

// GET /monthlyAttendance
export const getAllMonthlyAttendance = async () => {
  const res = await axiosClient.get("/monthlyAttendance");
  return normalizeData(res);
};

// GET /monthlyAttendance/employee/:employeeId
export const getMonthlyAttendanceByEmployeeId = async (employeeId) => {
  const res = await axiosClient.get(`/monthlyAttendance/employee/${employeeId}`);
  return normalizeData(res);
};

// POST /monthlyAttendance
export const addMonthlyAttendance = async (data) => {
  const res = await axiosClient.post("/monthlyAttendance", data);
  return res.data;
};

// PUT /monthlyAttendance/:id
export const updateMonthlyAttendance = async (id, data) => {
  const res = await axiosClient.put(`/monthlyAttendance/${id}`, data);
  return res.data;
};

// DELETE /monthlyAttendance/:id
export const removeMonthlyAttendance = async (id) => {
  const res = await axiosClient.delete(`/monthlyAttendance/${id}`);
  return res.data;
};
