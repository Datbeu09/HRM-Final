// src/routes/payrollApproval.routes.js
const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/payrollApproval.controller");
const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");

router.get("/ping", (req, res) => res.json({ ok: true, route: "payroll-approval" }));

// ✅ permission code bạn đổi theo hệ thống của bạn
router.get("/", requireAuth, requirePermission("PAYROLL_VIEW"), ctrl.get);

router.post("/auto-check", requireAuth, requirePermission("PAYROLL_APPROVE"), ctrl.autoCheck);
router.post("/approve", requireAuth, requirePermission("PAYROLL_APPROVE"), ctrl.approve);
router.post("/request-edit", requireAuth, requirePermission("PAYROLL_APPROVE"), ctrl.requestEdit);

// ✅ THÊM 2 ROUTE FE ĐANG GỌI
router.post("/send-email", requireAuth, requirePermission("PAYROLL_APPROVE"), ctrl.sendEmail);
router.post("/export", requireAuth, requirePermission("PAYROLL_VIEW"), ctrl.exportExcel);

module.exports = router;