// utils/payrollLock.js
const ApiError = require("./ApiError");

function canEditLockedPayroll(req) {
  const role = String(req.user?.role || "").toUpperCase();
  return role === "ADMIN";
}

function assertPayrollEditable({ req, locked }) {
  if (Number(locked) === 1 && !canEditLockedPayroll(req)) {
    throw new ApiError(403, "Bảng lương đã chốt, không được chỉnh sửa");
  }
}

module.exports = { assertPayrollEditable, canEditLockedPayroll };