// src/api/departments.api.js
import axiosClient from './axiosClient';

// API lấy danh sách phòng ban
export const getDepartments = async () => {
  try {
    const response = await axiosClient.get('/departments');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lấy danh sách phòng ban thất bại');
  }
};

// API thêm phòng ban
export const addDepartment = async (departmentData) => {
  try {
    const response = await axiosClient.post('/departments', departmentData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Thêm phòng ban thất bại');
  }
};

// API cập nhật phòng ban
export const updateDepartment = async (departmentId, departmentData) => {
  try {
    const response = await axiosClient.put(`/departments/${departmentId}`, departmentData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Cập nhật phòng ban thất bại');
  }
};

// API xóa phòng ban
export const deleteDepartment = async (departmentId) => {
  try {
    const response = await axiosClient.delete(`/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Xóa phòng ban thất bại');
  }
};
