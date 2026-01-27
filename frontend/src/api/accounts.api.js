import axios from "axios";

// Lấy token từ localStorage (hoặc từ nơi bạn lưu trữ token)
const getAuthToken = () => {
  return localStorage.getItem("token");  // Hoặc dùng context/state tùy vào ứng dụng của bạn
};

// Hàm chuẩn bị header
const getHeaders = () => {
  const token = getAuthToken();  // Lấy token từ storage
  if (!token) {
    console.error("No token found in localStorage.");
    return {};  // Nếu không có token, trả về object rỗng
  }
  return {
    Authorization: `Bearer ${token}`,  // Thêm token vào header
  };
};

// API lấy danh sách người dùng
export const getUserList = async () => {
  try {
    const response = await axios.get("/api/accounts", {
      headers: getHeaders(), // Gửi token trong header
    });
    console.log("API Response:", response.data);  // Log API Response để kiểm tra dữ liệu trả về
    return response.data.data || [];  // Đảm bảo trả về mảng nếu không có dữ liệu
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];  // Trả về mảng rỗng nếu có lỗi
  }
};

// API thêm mới người dùng
export const addUser = async (user) => {
  try {
    const response = await axios.post("/api/accounts", user, {
      headers: getHeaders(),  // Gửi token trong header
    });
    console.log("User added:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// API cập nhật người dùng
export const updateUser = async (user) => {
  try {
    const response = await axios.put(`/api/accounts/${user.id}`, user, {
      headers: getHeaders(),  // Gửi token trong header
    });
    console.log("User updated:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// API xóa người dùng
export const deleteUser = async (id) => {
  try {
    await axios.delete(`/api/accounts/${id}`, {
      headers: getHeaders(),  // Gửi token trong header
    });
    console.log("User deleted:", id);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
