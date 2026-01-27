const ApiError = require("../utils/ApiError");

module.exports = (err, req, res, next) => {
  // log gọn + thấy rõ
  console.error("[ERROR]", err);

  // Nếu là ApiError thì trả đúng status + message
  if (err instanceof ApiError) {
    return res.status(err.statusCode || err.status || 400).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Các lỗi khác
  return res.status(500).json({
    message: err.message || "Something went wrong",
  });
};
