// src/middleware/requireAnyPermission.js
const ApiError = require("../utils/ApiError");

module.exports = function requireAnyPermission(required = []) {
  const need = Array.isArray(required) ? required : [required];

  return (req, _res, next) => {
    const current = req.user?.permissions || [];
    const ok = need.some((p) => current.includes(p));

    if (!ok) {
      return next(
        new ApiError(403, "Forbidden", {
          requiredAny: need,
          current,
        })
      );
    }

    next();
  };
};