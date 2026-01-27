const express = require("express");
const router = express.Router();
const c = require("../controllers/departments.controller");

// CRUD
router.get("/", c.list);        // GET    /api/departments
router.get("/:id", c.getById);  // GET    /api/departments/:id
router.post("/", c.create);     // POST   /api/departments
router.put("/:id", c.update);   // PUT    /api/departments/:id
router.delete("/:id", c.remove);// DELETE /api/departments/:id

module.exports = router;
