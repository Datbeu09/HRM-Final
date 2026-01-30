// backend/src/routes/monthlyAttendance.routes.js
const express = require("express");
const router = express.Router();

const controller = require("../controllers/monthlyAttendance.controller");

// ✅ GET /api/monthlyAttendance
router.get("/", controller.list);

// ✅ GET /api/monthlyAttendance/by-employee-month?employeeId=..&month=..&year=..
router.get("/by-employee-month", controller.getByEmployeeMonth);

// ✅ POST /api/monthlyAttendance/ensure
router.post("/ensure", controller.ensure);

// ✅ POST /api/monthlyAttendance/:id/submit
router.post("/:id/submit", controller.submit);

// ✅ POST /api/monthlyAttendance/:id/approve
router.post("/:id/approve", controller.approve);

// ✅ POST /api/monthlyAttendance/:id/reject
router.post("/:id/reject", controller.reject);

// ✅ PATCH /api/monthlyAttendance/:id/lock
router.patch("/:id/lock", controller.lock);

module.exports = router;
