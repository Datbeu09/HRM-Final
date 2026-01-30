// src/api/monthlySalary.api.js
import axiosClient from "./axiosClient";

const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

// ✅ GET /monthlySalary  -> backend service của bạn có getAll()
export const getAllMonthlySalary = async (config = {}) => {
  const res = await axiosClient.get("/monthlySalary", config);
  const data = unwrap(res);
  return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
};

// Giữ lại nếu bạn đang dùng:
export const getSalaryByDepartment = (monthYYYYMM, config = {}) => {
  return axiosClient.get("/monthlySalary/by-department", {
    ...config,
    params: { month: monthYYYYMM },
  });
};

export const getPendingCount = (monthYYYYMM, config = {}) => {
  return axiosClient.get("/monthlySalary/pending-count", {
    ...config,
    params: { month: monthYYYYMM },
  });
};
