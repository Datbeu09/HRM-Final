module.exports = function handleLoginError(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = err?.statusCode || err?.status || 500;
  const msg = err?.message || "LOGIN_FAILED";

  // Chuẩn hóa message để frontend bắt case
  if (msg === "MISSING_CREDENTIALS") {
    return res.status(400).json({ success: false, message: "MISSING_CREDENTIALS" });
  }

  if (msg === "INVALID_USERNAME") {
    return res.status(401).json({ success: false, message: "INVALID_USERNAME" });
  }

  if (msg === "INVALID_PASSWORD") {
    return res.status(401).json({ success: false, message: "INVALID_PASSWORD" });
  }

  if (msg === "ACCOUNT_INACTIVE") {
    return res.status(403).json({ success: false, message: "ACCOUNT_INACTIVE" });
  }

  // fallback cho 401
  if (status === 401) {
    return res.status(401).json({ success: false, message: "LOGIN_FAILED" });
  }

  return res.status(status).json({
    success: false,
    message: "LOGIN_FAILED",
  });
};
