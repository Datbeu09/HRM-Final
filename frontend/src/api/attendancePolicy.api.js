// src/api/attendancePolicy.api.js
import axiosClient from './axiosClient';

// API lấy danh sách chính sách điểm danh
export const getAttendancePolicies = async () => {
  try {
    const response = await axiosClient.get('/attendancePolicy');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lấy danh sách chính sách điểm danh thất bại');
  }
};

// API thêm chính sách điểm danh
export const addAttendancePolicy = async (policyData) => {
  try {
    const response = await axiosClient.post('/attendancePolicy', policyData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Thêm chính sách điểm danh thất bại');
  }
};

// API cập nhật chính sách điểm danh
export const updateAttendancePolicy = async (policyId, policyData) => {
  try {
    const response = await axiosClient.put(`/attendancePolicy/${policyId}`, policyData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Cập nhật chính sách điểm danh thất bại');
  }
};

// API xóa chính sách điểm danh
export const deleteAttendancePolicy = async (policyId) => {
  try {
    const response = await axiosClient.delete(`/attendancePolicy/${policyId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Xóa chính sách điểm danh thất bại');
  }
};
