// src/api/view/employeeFamilyRows.api.js
import axiosClient from '../axiosClient';

// Lấy thông tin nhân viên và gia đình theo dạng dòng (mỗi nhân viên 1 dòng)
export const getEmployeeFamilyRows = async () => {
  try {
    const response = await axiosClient.get('/employee-family-rows/view');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lỗi khi lấy thông tin nhân viên và gia đình theo dòng');
  }
};
