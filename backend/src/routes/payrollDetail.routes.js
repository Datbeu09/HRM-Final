// src/routes/payrollDetail.route.js
const express = require("express");
const payrollDetailController = require("../controllers/payrollDetail.controller");
const payslipMailController = require("../controllers/payslipMail.controller");

const router = express.Router();

router.get("/:employeeId", payrollDetailController.getDetail);

// ✅ gửi email phiếu lương
router.post("/:employeeId/send-payslip-email", payslipMailController.sendPayslipEmail);

module.exports = router;