const express = require("express");
const router = express.Router();

const c = require("../controllers/permanentEmployees.controller");
const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");

// VIEW
router.get(
  "/",
  requireAuth,
  requirePermission("EMPLOYEE_MANAGE"),
  c.getAll
);

router.get(
  "/:employeeId",
  requireAuth,
  requirePermission("EMPLOYEE_MANAGE"),
  c.getByEmployeeId
);

// CREATE / UPDATE / DELETE
router.post(
  "/",
  requireAuth,
  requirePermission("SALARY_APPROVE"),
  c.create
);

router.put(
  "/:employeeId",
  requireAuth,
  requirePermission("SALARY_APPROVE"),
  c.update
);

router.delete(
  "/:employeeId",
  requireAuth,
  requirePermission("SALARY_APPROVE"),
  c.remove
);

module.exports = router;
