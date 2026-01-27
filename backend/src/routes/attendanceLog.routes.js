// src/routes/attendanceLog.routes.js
const express = require("express");
const router = express.Router();

const c = require("../controllers/attendanceLog.controller");
const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");

// ===== ROUTES =====

// ===== GET =====
// Admin / Director / HR / Kế toán
router.get(
  "/",
  requireAuth,
  requirePermission("ATTENDANCE_SUMMARY"),
  c.getAll
);

router.get(
  "/:id",
  requireAuth,
  requirePermission("ATTENDANCE_SUMMARY"),
  c.getById
);

router.get(
  "/employee/:employeeId/date/:workDate",
  requireAuth,
  requirePermission("ATTENDANCE_SUMMARY"),
  c.getByEmployeeAndDate
);

// ===== POST =====
// Nhân viên chấm công
router.post(
  "/",
  requireAuth,
  requirePermission("ATTENDANCE_CHECKIN"),
  c.create
);

// ===== PUT =====
// HR / Admin sửa chấm công
router.put(
  "/:id",
  requireAuth,
  requirePermission("ATTENDANCE_SUMMARY"),
  c.update
);

// ===== DELETE =====
// Admin (hoặc HR nếu bạn muốn)
router.delete(
  "/:id",
  requireAuth,
  requirePermission("ATTENDANCE_SUMMARY"),
  c.remove
);

module.exports = router;
