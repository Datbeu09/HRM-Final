const express = require("express");
const router = express.Router();
const c = require("../controllers/workAssignment.controller");

// ❗ KHÔNG router.use(requireAuth) nếu requireAuth export default function
// nếu có auth thì:
// router.use(requireAuth);

router.get("/", c.getAllWorkAssignments);
router.get("/:id", c.getWorkAssignmentById);
router.post("/", c.createWorkAssignment);
router.put("/:id", c.updateWorkAssignment);
router.delete("/:id", c.deleteWorkAssignment);

module.exports = router;
