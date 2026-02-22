// routes/payrollApproval.routes.js
const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/payrollApproval.controller");
const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");

router.get("/ping", (req, res) => res.json({ ok: true, route: "payroll-approval" }));

// GET /api/payroll-approval?month=YYYY-MM&department=...
router.get("/", requireAuth, requirePermission("SALARY_VIEW"), ctrl.get);

// POST /api/payroll-approval/auto-check
router.post(
  "/auto-check",
  requireAuth,
  requirePermission("SALARY_APPROVE"),
  ctrl.autoCheck
);

// POST /api/payroll-approval/approve
router.post(
  "/approve",
  requireAuth,
  requirePermission("SALARY_APPROVE"),
  ctrl.approve
);

// ✅ POST /api/payroll-approval/approve-and-email
router.post(
  "/approve-and-email",
  requireAuth,
  requirePermission("SALARY_APPROVE"),
  ctrl.approveAndEmail
);

// ✅ POST /api/payroll-approval/unapprove  (CHỈ ADMIN)
router.post(
  "/unapprove",
  requireAuth,
  requirePermission("ADMIN"),
  ctrl.unapprove
);

// POST /api/payroll-approval/request-edit
router.post(
  "/request-edit",
  requireAuth,
  requirePermission("SALARY_APPROVE"),
  ctrl.requestEdit
);

// POST /api/payroll-approval/export
router.post(
  "/export",
  requireAuth,
  requirePermission("SALARY_VIEW"),
  ctrl.exportExcel
);

module.exports = router;