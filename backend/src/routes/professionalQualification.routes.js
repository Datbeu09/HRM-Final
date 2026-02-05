const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requirePermission = require("../middleware/requirePermission");
const controller = require("../controllers/professionalQualifications.controller");

router.use(requireAuth);

router.get("/", requirePermission("PROFESSIONAL_QUALIFICATION_READ"), controller.getAll);
router.get("/:id", requirePermission("PROFESSIONAL_QUALIFICATION_READ"), controller.getById);
router.post("/", requirePermission("professionalQualification:create"), controller.create);
router.put("/:id", requirePermission("professionalQualification:update"), controller.update);
router.delete("/:id", requirePermission("professionalQualification:delete"), controller.remove);

module.exports = router;