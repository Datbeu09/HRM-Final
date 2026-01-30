// src/routes/workAssignmentResponse.routes.js
const express = require("express");
const router = express.Router();

const controller = require("../controllers/workAssignmentResponse.controller");
const requireAuth = require("../middleware/requireAuth");

// bắt buộc đăng nhập
router.use(requireAuth);

// ✅ employee xem phản hồi của chính mình
router.get("/me", controller.listMy);

// admin list
router.get("/", controller.list);

// employee tạo phản hồi
router.post("/", controller.create);

module.exports = router;
