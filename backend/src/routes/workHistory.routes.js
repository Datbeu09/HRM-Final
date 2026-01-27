const express = require("express");
const router = express.Router();
const c = require("../controllers/workHistory.controller");

// Bắt lỗi import sớm (rất nên có 👍)
if (!c || typeof c.getAllWorkHistories !== "function") {
  throw new Error("workHistoryController export/import mismatch");
}

router.get("/", c.getAllWorkHistories);
router.get("/employee/:employeeId", c.getWorkHistoryByEmployeeId);
router.get("/:id", c.getWorkHistoryById);
router.post("/", c.addWorkHistory);
router.put("/:id", c.updateWorkHistory);
router.delete("/:id", c.deleteWorkHistory);

module.exports = router;
