// src/routes/approvals.routes.js
const express = require("express");
const router = express.Router();

const c = require("../controllers/approvals.controller");
const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");

// LIST + GET
router.get("/", requireAuth, requirePermission("REQUEST_APPROVE"), c.list);
router.get("/:id", requireAuth, requirePermission("REQUEST_APPROVE"), c.getById);

// EMPLOYEE CREATE (hoặc admin tạo hộ)
router.post("/", requireAuth, requirePermission("approvals:create"), c.create);

// UPDATE / DELETE
router.put("/:id", requireAuth, requirePermission("approvals:update"), c.update);
router.delete("/:id", requireAuth, requirePermission("approvals:delete"), c.remove);

// ADMIN actions
router.post("/:id/approve", requireAuth, requirePermission("approvals:approve"), c.approve);
router.post("/:id/reject", requireAuth, requirePermission("approvals:reject"), c.reject);

module.exports = router;
