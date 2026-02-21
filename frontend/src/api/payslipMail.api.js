// src/api/payslipMail.api.js
import axiosClient from "./axiosClient";

export const sendPayslipEmail = async ({ employeeId, month }) => {
  return axiosClient.post(
    `/payroll-detail/${employeeId}/send-payslip-email`,
    {}, // ✅ gửi object rỗng để express.json parse OK
    {
      params: { month },
      timeout: 120000,
    }
  );
};