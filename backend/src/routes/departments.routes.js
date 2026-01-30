const express = require("express");
const router = express.Router();

const controller = require("../controllers/departments.controller");
// const requireAuth = require("../middleware/requireAuth");

// GET /api/departments
router.get("/", controller.list);

// GET /api/departments/:id
router.get("/:id", controller.getById);

// POST /api/departments
router.post("/", controller.create);

// PUT /api/departments/:id
router.put("/:id", controller.update);

// DELETE /api/departments/:id
router.delete("/:id", controller.remove);

module.exports = router;
