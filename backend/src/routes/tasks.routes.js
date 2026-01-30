const express = require("express");
const router = express.Router();

const controller = require("../controllers/tasks.controller");

// debug nhanh: xem có undefined không
// console.log("tasks.controller keys =", Object.keys(controller));

router.get("/", controller.listTasks);
router.get("/:id", controller.getTaskById);
router.post("/", controller.createTask);
router.put("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;
