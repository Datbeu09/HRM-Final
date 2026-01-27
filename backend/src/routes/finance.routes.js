const express = require("express");
const router = express.Router();
const financeController = require("../controllers/finance.controller");

router.get("/dashboard", financeController.getDashboard);
router.get("/tax-summary", financeController.getTaxSummary);

module.exports = router;
