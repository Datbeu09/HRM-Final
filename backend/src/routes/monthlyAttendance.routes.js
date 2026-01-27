const express = require("express");
const router = express.Router();
const c = require("../controllers/monthlyAttendance.controller");

// CRUD
router.get("/", c.getAll);
router.get("/:id", c.getById);
router.get("/employee/:employeeId", c.getByEmployee);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", c.remove);

module.exports = router;
