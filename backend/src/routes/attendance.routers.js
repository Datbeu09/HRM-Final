const router = require("express").Router();
const ctrl = require("../controllers/attendance.controller");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

// me dashboard
router.get("/me", ctrl.getMeAttendance);

// actions
router.post("/check-in", ctrl.checkIn);
router.post("/check-out", ctrl.checkOut);

// lists
router.get("/recent", ctrl.getRecent);
router.get("/monthly-summary", ctrl.getMonthlySummary);

// detail page
router.get("/detail", ctrl.getEmployeeMonthDetail);
router.put("/daily/:id", ctrl.updateDaily);

module.exports = router;
