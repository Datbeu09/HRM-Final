// src/routes/payrollDetail.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/payrollDetail.controller");

// GET /api/payroll-detail/:employeeId?month=YYYY-MM
router.get("/:employeeId", controller.getDetail);

module.exports = router;
