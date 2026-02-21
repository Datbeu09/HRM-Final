// routes/payrollApproval.routes.js
const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/payrollApproval.controller");
const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");

router.get("/ping", (req, res) => res.json({ ok: true, route: "payroll-approval" }));

router.get("/", requireAuth, requirePermission("SALARY_VIEW"), ctrl.get);

router.post("/auto-check", requireAuth, requirePermission("SALARY_APPROVE"), ctrl.autoCheck);
router.post("/approve", requireAuth, requirePermission("SALARY_APPROVE"), ctrl.approve);

// ✅ NEW: chốt + export + gửi mail (1 lần gọi)
router.post(
  "/approve-and-email",
  requireAuth,
  requirePermission("SALARY_APPROVE"),
  ctrl.approveAndEmail
);

// vẫn giữ mở khóa nếu cần (nhưng FE sẽ disable nên không dùng nữa)
router.post("/unapprove", requireAuth, requirePermission("ADMIN"), ctrl.unapprove);

router.post("/request-edit", requireAuth, requirePermission("SALARY_APPROVE"), ctrl.requestEdit);

router.post("/export", requireAuth, requirePermission("SALARY_VIEW"), ctrl.exportExcel);

module.exports = router;