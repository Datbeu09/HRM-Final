const express = require("express");
const router = express.Router();

const c = require("../controllers/positions.controller");
const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");

router.use(requireAuth);

router.get("/", requirePermission("POSITION_VIEW"), c.list);
router.get("/:id", requirePermission("POSITION_VIEW"), c.getById);
router.post("/", requirePermission("POSITION_MANAGE"), c.create);
router.put("/:id", requirePermission("POSITION_MANAGE"), c.update);
router.delete("/:id", requirePermission("POSITION_MANAGE"), c.remove);

module.exports = router;
