const express = require("express");
const router = express.Router();
const SalaryPaymentController = require("../controllers/salaryPayment.controller");

console.log("✅ salaryPayment.routes.js LOADED");

// test route
router.get("/test", (req, res) => {
  res.json({ message: "Salary Payment route OK 🚀" });
});

// CRUD
router.post("/", SalaryPaymentController.create);
router.get("/", SalaryPaymentController.getAll);
router.get("/:id", SalaryPaymentController.getById);
router.put("/:id", SalaryPaymentController.update);
router.delete("/:id", SalaryPaymentController.delete);

module.exports = router;