// src/api/payrollApproval.api.js
import axiosClient from "./axiosClient";

function unwrap(res) {
  const d = res?.data;
  if (!d) return null;

  // { success:true, data:{...} }
  if (d.data && typeof d.data === "object") {
    if (d.data.data && typeof d.data.data === "object") return d.data.data;
    return d.data;
  }
  return d;
}

export const getPayrollApproval = async ({ month, department } = {}) => {
  const res = await axiosClient.get("/payroll-approval", {
    params: { month, department: department || undefined },
  });
  return unwrap(res);
};

export const autoCheckPayroll = async ({ month, department } = {}) => {
  const res = await axiosClient.post("/payroll-approval/auto-check", {
    month,
    department: department || undefined,
  });
  return unwrap(res);
};

export const approvePayroll = async ({ month, department } = {}) => {
  const res = await axiosClient.post("/payroll-approval/approve", {
    month,
    department: department || undefined,
  });
  return unwrap(res);
};

export const requestPayrollEdit = async ({ month, department, employeeId, reason } = {}) => {
  const res = await axiosClient.post("/payroll-approval/request-edit", {
    month,
    department: department || undefined,
    employeeId,
    reason,
  });
  return unwrap(res);
};

export const sendPayrollEmail = async ({ month, department } = {}) => {
  const res = await axiosClient.post("/payroll-approval/send-email", {
    month,
    department: department || undefined,
  });
  return unwrap(res);
};

export const exportPayrollToExcel = async ({ month, department } = {}) => {
  const res = await axiosClient.post(
    "/payroll-approval/export",
    { month, department: department || undefined },
    { responseType: "blob" }
  );
  return res?.data; // blob
};