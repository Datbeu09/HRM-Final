// src/routes/contractEmployees.routes.js
const express = require("express");
const router = express.Router();

const c = require("../controllers/contractEmployees.controller");
const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");

// ===== ROUTES =====

// VIEW
router.get(
  "/",
  requireAuth,
  requirePermission("EMPLOYEE_VIEW"),
  c.list
);

router.get(
  "/:employeeId",
  requireAuth,
  requirePermission("EMPLOYEE_VIEW"),
  c.getByEmployeeId
);

// MANAGE
router.post(
  "/",
  requireAuth,
  requirePermission("EMPLOYEE_MANAGE"),
  c.create
);

router.put(
  "/:employeeId",
  requireAuth,
  requirePermission("EMPLOYEE_MANAGE"),
  c.update
);

router.delete(
  "/:employeeId",
  requireAuth,
  requirePermission("EMPLOYEE_MANAGE"),
  c.remove
);

module.exports = router;
