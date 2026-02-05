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
  // GET /api/payroll-approval?month=2026-01&department=1
  async get(req, res, next) {
    try {
      let { month, department } = req.query;
      if (!month) month = currentYYYYMM();

      const data = await service.getPayrollApproval({
        monthStr: month,
        department, // ✅ departmentId
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
      let { month, department, approvedByAccountId } = req.body || {};
      if (!month) month = currentYYYYMM();

      const approverId = req.user?.id || approvedByAccountId;
      if (!approverId) throw new ApiError(401, "Missing approvedByAccountId");

      const data = await service.approve({
        monthStr: month,
        department,
        approvedByAccountId: approverId,
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

  // POST /api/payroll-approval/send-email
  async sendEmail(req, res, next) {
    try {
      let { month, department } = req.body || {};
      if (!month) month = currentYYYYMM();

      const byAccountId = req.user?.id || null;

      const data = await service.sendPayrollEmail({
        monthStr: month,
        department,
        byAccountId,
      });

      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  // POST /api/payroll-approval/export
  async exportExcel(req, res, next) {
    try {
      let { month, department } = req.body || {};
      if (!month) month = currentYYYYMM();

      const { buffer, filename } = await service.exportPayrollToExcel({
        monthStr: month,
        department,
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (e) {
      next(e);
    }
  },
};