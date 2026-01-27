const express = require("express");
const router = express.Router();

const controller = require("../controllers/tasks.controller");

// CRUD
router.get("/", controller.listTasks);
router.get("/:id", controller.getTaskById);
router.post("/", controller.createTask);
router.put("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;
