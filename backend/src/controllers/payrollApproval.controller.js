// src/controllers/payrollApproval.controller.js
const service = require("../services/payrollApproval.service");
const ApiError = require("../utils/ApiError");

function currentYYYYMM() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

module.exports = {
  // GET /api/payroll-approval?month=2026-01&department=Marketing
  async get(req, res, next) {
    try {
      let { month, department } = req.query;
      if (!month) month = currentYYYYMM();

      const data = await service.getPayrollApproval({
        monthStr: month,
        department,
      });

      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  // POST /api/payroll-approval/auto-check
  async autoCheck(req, res, next) {
    try {
      let { month, department } = req.body || {};
      if (!month) month = currentYYYYMM();

      const data = await service.autoCheck({ monthStr: month, department });
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  // POST /api/payroll-approval/approve
  async approve(req, res, next) {
    try {
      let { month, department } = req.body || {};
      if (!month) month = currentYYYYMM();

      const approvedByAccountId = req.user?.id || req.body?.approvedByAccountId;
      if (!approvedByAccountId) throw new ApiError(401, "Missing approvedByAccountId");

      const data = await service.approve({
        monthStr: month,
        department,
        approvedByAccountId,
      });

      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  // POST /api/payroll-approval/request-edit
  async requestEdit(req, res, next) {
    try {
      let { month, department, employeeId, reason } = req.body || {};
      if (!month) month = currentYYYYMM();

      const createdByAccountId = req.user?.id || null;

      const data = await service.requestEdit({
        monthStr: month,
        department,
        employeeId,
        reason,
        createdByAccountId,
      });

      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },
};
