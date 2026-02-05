const express = require("express");
console.log("✅ leaveRequest.routes.js loaded");

const router = express.Router();
const LeaveRequestController = require("../controllers/leaveRequest.controller");

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Leave Request route OK 🚀" });
});

// CRUD
router.post("/", LeaveRequestController.create);
router.get("/", LeaveRequestController.getAll);
router.get("/:id", LeaveRequestController.getById);
router.put("/:id", LeaveRequestController.update);
router.delete("/:id", LeaveRequestController.delete);

module.exports = router;