// src/api/view/employeeFamily.api.js
import axiosClient from '../axiosClient'; // Axios đã được cấu hình từ trước

// Lấy danh sách gia đình của nhân viên theo employeeId
export const getFamilyByEmployeeId = async (employeeId) => {
  try {
    const response = await axiosClient.get(`/employee-family/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lỗi khi lấy thông tin gia đình nhân viên');
  }
};
