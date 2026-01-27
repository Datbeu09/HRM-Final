// src/routes/dailyAttendance.routes.js
const express = require("express");
const router = express.Router();

const c = require("../controllers/dailyAttendance.controller");
const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");

// ===== GET =====
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
  "/employee/:employeeId/date/:date",
  requireAuth,
  requirePermission("ATTENDANCE_SUMMARY"),
  c.getByEmployeeAndDate
);

// ===== CREATE =====
router.post(
  "/",
  requireAuth,
  requirePermission("ATTENDANCE_CHECKIN"),
  c.create
);

// ===== UPDATE =====
router.put(
  "/:id",
  requireAuth,
  requirePermission("ATTENDANCE_CHECKIN"),
  c.update
);

// ===== DELETE =====
router.delete(
  "/:id",
  requireAuth,
  requirePermission("ATTENDANCE_CHECKIN"),
  c.remove
);

module.exports = router;
