const express = require("express");
const router = express.Router();

const { login } = require("../controllers/auth.controller");
const handleLoginError = require("../middleware/handleLoginError");

// Route đăng nhập
router.post("/login", login, handleLoginError);

module.exports = router;
