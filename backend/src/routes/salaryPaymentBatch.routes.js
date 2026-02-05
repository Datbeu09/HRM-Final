// routes/salaryPaymentBatch.routes.js
const express = require("express");
const router = express.Router();
const SalaryPaymentBatchController = require("../controllers/salaryPaymentBatch.controller");

console.log("✅ salaryPaymentBatch.routes.js LOADED");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ message: "Salary Payment Batch route OK 🚀" });
});

// CRUD
router.post("/", SalaryPaymentBatchController.create);
router.get("/", SalaryPaymentBatchController.getAll);

// 🔥 CHỐT LỖI 404: chỉ match ID là số
router.get("/:id(\\d+)", SalaryPaymentBatchController.getById);
router.put("/:id(\\d+)", SalaryPaymentBatchController.update);
router.delete("/:id(\\d+)", SalaryPaymentBatchController.delete);

module.exports = router;