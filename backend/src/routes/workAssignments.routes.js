const express = require("express");
const router = express.Router();

const controller = require("../controllers/workAssignment.controller");
// const requireAuth = require("../middleware/requireAuth");

// GET /api/workAssignments
router.get("/", controller.getAllWorkAssignments);

// GET /api/workAssignments/:id
router.get("/:id", controller.getWorkAssignmentById);

// POST /api/workAssignments
router.post("/", controller.createWorkAssignment);

// PUT /api/workAssignments/:id
router.put("/:id", controller.updateWorkAssignment);

// DELETE /api/workAssignments/:id (soft delete)
router.delete("/:id", controller.deleteWorkAssignment);

module.exports = router;
