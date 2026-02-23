// src/routes/approvals.routes.js
const express = require("express");
const router = express.Router();

const c = require("../controllers/approvals.controller");
const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");
const requireAnyPermission = require("../middleware/requireAnyPermission");

/**
 * RULE
 * - HR/DIRECTOR/ADMIN: tạo + duyệt (REQUEST_APPROVE)
 * - KT + Nhân viên: chỉ tạo (LEAVE_REQUEST)
 */

// =========================
// EMPLOYEE/KT/HR/DIR/ADMIN: tạo đơn + xem đơn theo employeeId
// =========================

// ✅ Nhân viên/KT: dùng LEAVE_REQUEST
// ✅ HR/DIR/ADMIN: cũng được phép (REQUEST_APPROVE)
router.get(
  "/employee/:employeeId",
  requireAuth,
  requireAnyPermission(["LEAVE_REQUEST", "REQUEST_APPROVE"]),
  c.getByEmployeeId
);

// ✅ Tạo đơn: NV/KT (LEAVE_REQUEST) + HR/DIR/ADMIN (REQUEST_APPROVE)
router.post(
  "/",
  requireAuth,
  requireAnyPermission(["LEAVE_REQUEST", "REQUEST_APPROVE"]),
  c.create
);

// =========================
// HR/DIRECTOR/ADMIN: xem tất cả + duyệt/từ chối + xoá/sửa
// =========================

router.get("/", requireAuth, requirePermission("REQUEST_APPROVE"), c.list);
router.get("/:id", requireAuth, requirePermission("REQUEST_APPROVE"), c.getById);

router.put("/:id", requireAuth, requirePermission("REQUEST_APPROVE"), c.update);
router.delete("/:id", requireAuth, requirePermission("REQUEST_APPROVE"), c.remove);

router.patch("/:id/approve", requireAuth, requirePermission("REQUEST_APPROVE"), c.approve);
router.patch("/:id/reject", requireAuth, requirePermission("REQUEST_APPROVE"), c.reject);

module.exports = router;