// src/api/departments.api.js
import axiosClient from "./axiosClient";

// helper: chịu cả 2 kiểu axiosClient
const unwrap = (res) => res?.data ?? res;

const normalizeDepartment = (d = {}) => ({
  id: d.id,
  departmentCode: d.departmentCode,
  departmentName: d.departmentName,
  created_at: d.created_at ?? d.createdAt ?? null,
  updated_at: d.updated_at ?? d.updatedAt ?? null,
});

export const getDepartments = async () => {
  const res = await axiosClient.get("/departments");
  const root = unwrap(res);

  // root có thể là:
  // 1) {success, data:[...]}
  // 2) {data:[...]} (nếu backend không bọc success)
  // 3) [...] (nếu backend trả array thẳng)
  const raw = Array.isArray(root?.data)
    ? root.data
    : Array.isArray(root)
    ? root
    : [];

  return raw.map(normalizeDepartment);
};

export const getDepartmentById = async (id) => {
  const res = await axiosClient.get(`/departments/${id}`);
  const root = unwrap(res);

  const raw = root?.data ?? root ?? null;
  return raw ? normalizeDepartment(raw) : null;
};
