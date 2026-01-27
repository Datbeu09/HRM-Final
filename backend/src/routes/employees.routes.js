// src/routes/employees.routes.js
const express = require("express");
const router = express.Router();

const c = require("../controllers/employees.controller");
const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");

// VIEW
router.get("/", requireAuth, requirePermission("EMPLOYEE_VIEW"), c.listEmployees);

// ✅ BULK phải đặt trước /:id
router.post("/bulk", requireAuth, requirePermission("EMPLOYEE_MANAGE"), c.bulkCreateEmployees);

router.get("/:id", requireAuth, requirePermission("EMPLOYEE_VIEW"), c.getEmployeeById);

// CREATE / UPDATE / DELETE
router.post("/", requireAuth, requirePermission("EMPLOYEE_MANAGE"), c.createEmployee);
router.put("/:id", requireAuth, requirePermission("EMPLOYEE_MANAGE"), c.updateEmployee);
router.delete("/:id", requireAuth, requirePermission("EMPLOYEE_MANAGE"), c.deleteEmployee);

module.exports = router;
