const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');  // Import hàm login từ controller

// Route đăng nhập
router.post("/login", login);

module.exports = router;
