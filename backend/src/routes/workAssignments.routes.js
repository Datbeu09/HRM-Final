const express = require("express");
const router = express.Router();

const controller = require("../controllers/workAssignment.controller");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

// employee
router.get("/me", controller.getMyWorkAssignments);

// ✅ employee update status của chính mình
router.patch("/:id/my-status", controller.updateMyWorkAssignmentStatus);

// admin filters
router.get("/", controller.getAllWorkAssignments);
router.get("/:id", controller.getWorkAssignmentById);
router.post("/", controller.createWorkAssignment);
router.put("/:id", controller.updateWorkAssignment);
router.delete("/:id", controller.deleteWorkAssignment);

module.exports = router;
