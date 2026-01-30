const express = require("express");
const router = express.Router();

const controller = require("../controllers/dailyAttendance.controller");

router.get("/by-employee-month", controller.getByEmployeeMonth);
router.post("/upsert", controller.upsert);

module.exports = router;
