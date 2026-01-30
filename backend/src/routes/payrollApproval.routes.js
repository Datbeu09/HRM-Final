// src/routes/payrollApproval.routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/payrollApproval.controller");

router.get("/ping", (req, res) => res.json({ ok: true, route: "payroll-approval" }));

router.get("/", ctrl.get);
router.post("/auto-check", ctrl.autoCheck);
router.post("/approve", ctrl.approve);
router.post("/request-edit", ctrl.requestEdit);

module.exports = router;
