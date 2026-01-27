
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Form is being submitted");  // Log kiểm tra khi nhấn submit
  try {
    // Gọi login từ AuthContext thay vì từ API
    await authLogin(username, password);  // Dùng authLogin từ Context

    // Điều hướng về trang chính sau khi đăng nhập thành công
    navigate("/");
    console.log("Navigating to home page...");
  } catch (err) {
    // Xử lý lỗi nếu đăng nhập thất bại
    setError(err.message || 'Đăng nhập thất bại');
    console.error("Error during login:", err);  // Log lỗi nếu có
  }
};
