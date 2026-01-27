// src/middleware/requirePermission.js
const ApiError = require("../utils/ApiError");

module.exports = (permissionCode) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return next(new ApiError(401, "Unauthenticated"));

    // ADMIN bypass
    if (user.role === "ADMIN") return next();

    const perms = Array.isArray(user.permissions) ? user.permissions : [];
    if (!perms.includes(permissionCode)) {
      const err = new ApiError(403, "Forbidden");
      err.details = {
        required: permissionCode,
        current: perms,
      };
      return next(err);
    }

    next();
  };
};
