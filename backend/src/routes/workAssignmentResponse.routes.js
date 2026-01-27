const express = require("express");
const router = express.Router();

const c = require("../controllers/workAssignmentResponse.controller");

// CRUD
router.get("/", c.list);          // GET    /api/work-assignment-responses
router.get("/:id", c.getById);    // GET    /api/work-assignment-responses/:id
router.post("/", c.create);       // POST   /api/work-assignment-responses
router.put("/:id", c.update);     // PUT    /api/work-assignment-responses/:id
router.delete("/:id", c.remove);  // DELETE /api/work-assignment-responses/:id

module.exports = router;
