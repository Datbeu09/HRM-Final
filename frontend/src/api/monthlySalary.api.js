import axiosClient from "./axiosClient";

// ✅ Controller BE: GET /monthlySalary/by-department?month=YYYY-MM
export const getSalaryByDepartment = (monthYYYYMM, config = {}) => {
  return axiosClient.get("/monthlySalary/by-department", {
    ...config,
    params: { month: monthYYYYMM },
  });
};

// ✅ Controller BE: GET /monthlySalary/pending-count?month=YYYY-MM
export const getPendingCount = (monthYYYYMM, config = {}) => {
  return axiosClient.get("/monthlySalary/pending-count", {
    ...config,
    params: { month: monthYYYYMM },
  });
};

// (optional) details
export const getMonthlySalaryDetails = ({ month, department }, config = {}) => {
  return axiosClient.get("/monthlySalary/details", {
    ...config,
    params: { month, department },
  });
};
