// src/api/role.api.js
import axiosClient from './axiosClient';

// API lấy danh sách vai trò
export const getRoles = async () => {
  try {
    const response = await axiosClient.get('/role');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lấy danh sách vai trò thất bại');
  }
};

// API tạo vai trò mới
export const createRole = async (roleData) => {
  try {
    const response = await axiosClient.post('/role', roleData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Tạo vai trò thất bại');
  }
};
