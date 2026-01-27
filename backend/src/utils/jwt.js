const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Lấy key từ .env hoặc mặc định
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h'; // Thời gian hết hạn của token

// Hàm tạo token
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Hàm xác minh token
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  signToken,
  verifyToken,
};
