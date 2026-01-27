const ApiError = require("../utils/ApiError");
const accountsService = require("../services/accounts.service");
const { getPermissionsByRole } = require("../services/auth.service"); // Lấy quyền theo role
const { signToken } = require("../utils/jwt");

module.exports = {

  // Đăng nhập và trả về token
  async login(req, res, next) {

    try {
      const { username, password } = req.body || {}; // Lấy dữ liệu từ body request
      if (!username || !password) throw new ApiError(400, "Username and password are required");
      console.log("Node:", process.version);
      console.log("accountsService path:", require.resolve("../services/accounts.service"));
      console.log("accountsService keys:", Object.keys(accountsService));
      console.log("typeof verifyLogin:", typeof accountsService.verifyLogin);

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
      res.json({
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

      next(e); // Xử lý lỗi
    }
  },
};
