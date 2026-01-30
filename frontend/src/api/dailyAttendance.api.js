import axiosClient from "./axiosClient";

export const getDailyAttendanceByEmployeeMonth = async ({ employeeId, month, year }) => {
  const res = await axiosClient.get("/daily-attendance/by-employee-month", {
    params: { employeeId, month, year },
  });
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

// Upsert theo (employeeId + date)
export const upsertDailyAttendance = async (payload) => {
  const res = await axiosClient.post("/daily-attendance/upsert", payload);
  return res.data?.data || null;
};
