import axiosClient from "./axiosClient";

// helper: chịu cả 2 kiểu axiosClient
const unwrap = (res) => res?.data ?? res;

const normalizeDepartment = (d = {}) => ({
  id: d.id,
  departmentCode: d.departmentCode,
  departmentName: d.departmentName,
  createdAt: d.created_at ?? d.createdAt ?? null, // sửa từ created_at thành createdAt
  updatedAt: d.updated_at ?? d.updatedAt ?? null, // sửa từ updated_at thành updatedAt
});

export const getDepartments = async () => {
  const res = await axiosClient.get("/departments");
  const root = unwrap(res);

  const raw = Array.isArray(root?.data) ? root.data : Array.isArray(root) ? root : [];
  return raw.map(normalizeDepartment);
};

export const getDepartmentById = async (id) => {
  const res = await axiosClient.get(`/departments/${id}`);
  const root = unwrap(res);

  const raw = root?.data ?? root ?? null;
  return raw ? normalizeDepartment(raw) : null;
};