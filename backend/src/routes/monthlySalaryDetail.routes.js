const express = require("express");
const router = express.Router();
const MonthlySalaryDetailController = require("../controllers/monthlySalaryDetail.controller");

// test route
router.get("/test", (req, res) => {
  res.json({ message: "MonthlySalaryDetail route OK 🚀" });
});

// CRUD
router.post("/", MonthlySalaryDetailController.create);
router.get("/", MonthlySalaryDetailController.getAll);
router.get("/:id", MonthlySalaryDetailController.getById);
router.put("/:id", MonthlySalaryDetailController.update);
router.delete("/:id", MonthlySalaryDetailController.delete);

module.exports = router;