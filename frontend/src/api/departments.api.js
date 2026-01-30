import axiosClient from "./axiosClient";

export const getDepartments = async () => {
  const res = await axiosClient.get("/departments");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const getDepartmentById = async (id) => {
  const res = await axiosClient.get(`/departments/${id}`);
  return res.data?.data || null;
};
