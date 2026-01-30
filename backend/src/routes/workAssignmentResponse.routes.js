const express = require("express");
const router = express.Router();

const controller = require("../controllers/workAssignmentResponse.controller");

// GET /api/work-assignment-responses
// ?workAssignmentId=1
// ?employeeId=2
router.get("/", controller.list);

// POST /api/work-assignment-responses
router.post("/", controller.create);

module.exports = router;
