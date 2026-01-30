// src/api/payrollDetail.api.js
import axiosClient from "./axiosClient";

function deepUnwrap(x) {
  let cur = x;
  if (cur && cur.data !== undefined) cur = cur.data;

  for (let i = 0; i < 3; i++) {
    if (cur && typeof cur === "object" && cur.data && typeof cur.data === "object") {
      cur = cur.data;
      continue;
    }
    break;
  }
  return cur;
}

export const getPayrollDetail = async ({ employeeId, month }) => {
  const res = await axiosClient.get(`/payroll-detail/${employeeId}`, {
    params: { month },
  });
  return deepUnwrap(res);
};
