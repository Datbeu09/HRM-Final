const ApiError = require("../utils/ApiError");
const { verifyToken } = require("../utils/jwt");

module.exports = (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    // Kiểm tra xem token có tồn tại không
    if (!token) {
      return next(new ApiError(401, "Missing Bearer token"));
    }

    // Giải mã token để lấy thông tin người dùng
    const decoded = verifyToken(token);

    // Đính kèm thông tin người dùng vào request
    req.user = decoded;

    // Tiếp tục với middleware hoặc route tiếp theo
    next();
  } catch (e) {
    // Xử lý lỗi nếu token không hợp lệ hoặc hết hạn
    return next(new ApiError(401, "Invalid or expired token"));
  }
};
