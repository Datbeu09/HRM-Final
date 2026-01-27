const express = require("express");
const router = express.Router();

const c = require("../controllers/familyMember.controller");
const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");

// CRUD FamilyMembers
router.get(
  "/",
  requireAuth,
  requirePermission("familyMembers:read"),
  c.list
);

router.get(
  "/:id",
  requireAuth,
  requirePermission("familyMembers:read"),
  c.getById
);

router.post(
  "/",
  requireAuth,
  requirePermission("familyMembers:create"),
  c.create
);

router.put(
  "/:id",
  requireAuth,
  requirePermission("familyMembers:update"),
  c.update
);

router.delete(
  "/:id",
  requireAuth,
  requirePermission("familyMembers:delete"),
  c.remove
);

module.exports = router;
