// src/api/attendance.api.js
import axiosClient from "./axiosClient";

// GET /attendance/detail?employeeId=&month=&year=
export const getEmployeeMonthDetail = async ({ employeeId, month, year }) => {
  const res = await axiosClient.get("/attendance/detail", {
    params: { employeeId, month, year },
  });
  return res.data?.data || null; // { summary, days }
};

// PUT /attendance/daily/:id  body: { notes }
export const updateDailyAttendance = async ({ id, notes }) => {
  const res = await axiosClient.put(`/attendance/daily/${id}`, { notes });
  return res.data?.data || null;
};
export const getMeAttendance = async () => {
  const res = await axiosClient.get("/attendance/me");
  return res.data?.data;
};

export const checkIn = async () => {
  const res = await axiosClient.post("/attendance/check-in");
  return res.data?.data;
};

export const checkOut = async () => {
  const res = await axiosClient.post("/attendance/check-out");
  return res.data?.data;
};

export const getRecentAttendance = async (limit = 4) => {
  const res = await axiosClient.get("/attendance/recent", { params: { limit } });
  return res.data?.data || [];
};

export const getMonthlySummary = async ({ month, year }) => {
  const res = await axiosClient.get("/attendance/monthly-summary", {
    params: { month, year },
  });
  return res.data?.data;
};