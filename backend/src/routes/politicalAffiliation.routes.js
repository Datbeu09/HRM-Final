const express = require("express");
const router = express.Router();
const c = require("../controllers/politicalAffiliation.controller");
const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");

router.use(requireAuth);

router.get(
  "/",
  requirePermission("politicalAffiliation:read"),
  c.list
);

router.get(
  "/:id",
  requirePermission("politicalAffiliation:read"),
  c.getById
);

router.post(
  "/",
  requirePermission("politicalAffiliation:create"),
  c.create
);

router.put(
  "/:id",
  requirePermission("politicalAffiliation:update"),
  c.update
);

router.delete(
  "/:id",
  requirePermission("politicalAffiliation:delete"),
  c.remove
);

module.exports = router;
