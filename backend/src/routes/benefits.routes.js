// src/routes/benefits.routes.js
const express = require("express");
const router = express.Router();
const c = require("../controllers/benefits.controller");

// test route
router.get("/ping", (req, res) => {
  res.json({ ok: true, ping: "benefits" });
});

// CRUD
router.get("/", c.list);
router.get("/employee/:employeeId", c.getByEmployee);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", c.remove);

module.exports = router;
