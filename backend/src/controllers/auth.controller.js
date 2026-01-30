const ApiError = require("../utils/ApiError");
const accountsService = require("../services/accounts.service");
const { getPermissionsByRole } = require("../services/auth.service");
const { signToken } = require("../utils/jwt");

module.exports = {
  // Đăng nhập và trả về token
  async login(req, res, next) {
    try {
      const { username, password } = req.body || {};

      if (!username || !password) {
        throw new ApiError(400, "MISSING_CREDENTIALS");
      }

      // Kiểm tra thông tin đăng nhập qua service
      const acc = await accountsService.verifyLogin({ username, password });

      // Lấy quyền của người dùng dựa trên role
      const permissions = await getPermissionsByRole(acc.role);

      // Tạo token cho người dùng
      const token = signToken({
        id: acc.id,
        username: acc.username,
        role: acc.role,
        employeeId: acc.employeeId,
        permissions,
      });

      // Trả về token và thông tin người dùng
      return res.json({
        success: true,
        data: {
          token,
          user: {
            id: acc.id,
            username: acc.username,
            role: acc.role,
            employeeId: acc.employeeId,
            permissions,
          },
        },
      });
    } catch (e) {
      return next(e);
    }
  },
};
