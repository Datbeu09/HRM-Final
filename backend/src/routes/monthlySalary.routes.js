const express = require("express");
const router = express.Router();
const c = require("../controllers/monthlySalary.controller");

const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");

// ================== VIEW SALARY ==================
// HR / Kế toán / Director

router.get(
  "/",
  requireAuth,
  requirePermission("SALARY_VIEW"),
  c.getAll
);

router.get(
  "/:id",
  requireAuth,
  requirePermission("SALARY_VIEW"),
  c.getById
);

router.get(
  "/employee/:employeeId",
  requireAuth,
  requirePermission("SALARY_VIEW"),
  c.getByEmployee
);

// ================== APPROVE / MANAGE SALARY ==================
// Kế toán / Director

router.post(
  "/",
  requireAuth,
  requirePermission("SALARY_APPROVE"),
  c.create
);

router.put(
  "/:id",
  requireAuth,
  requirePermission("SALARY_APPROVE"),
  c.update
);

router.delete(
  "/:id",
  requireAuth,
  requirePermission("SALARY_APPROVE"),
  c.remove
);

module.exports = router;
