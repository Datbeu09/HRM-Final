// src/routes/accounts.routes.js
const express = require("express");
const router = express.Router();

const c = require("../controllers/accounts.controller");
const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");

// auth
router.post("/login", c.login);

// CRUD
router.get("/", requireAuth, requirePermission("accounts:read"), c.list);
router.get("/:id", requireAuth, requirePermission("accounts:read"), c.getById);

router.post("/", requireAuth, requirePermission("accounts:create"), c.create);
router.put("/:id", requireAuth, requirePermission("accounts:update"), c.update);
router.delete("/:id", requireAuth, requirePermission("accounts:delete"), c.remove);

module.exports = router;
