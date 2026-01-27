const bcrypt = require("bcryptjs");

module.exports = {
  // Mã hóa mật khẩu
  async hash(pw) {
    try {
      // bcrypt.hash() trả về một Promise, vì vậy dùng await để đợi kết quả
      const hashedPassword = await bcrypt.hash(pw, 10);
      return hashedPassword;
    } catch (error) {
      throw new Error("Error hashing password");  // Xử lý lỗi nếu có
    }
  },

  // So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong cơ sở dữ liệu
  async compare(pw, hash) {
    try {
      // bcrypt.compare() trả về một Promise, vì vậy dùng await để đợi kết quả
      const isMatch = await bcrypt.compare(pw, hash);
      return isMatch;
    } catch (error) {
      throw new Error("Error comparing passwords");  // Xử lý lỗi nếu có
    }
  },
};
