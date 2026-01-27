// src/api/permissions.api.js
import axiosClient from './axiosClient';

// API lấy danh sách quyền hạn
export const getPermissions = async () => {
  try {
    const response = await axiosClient.get('/permissions');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lấy danh sách quyền hạn thất bại');
  }
};

// API thêm quyền hạn
export const addPermission = async (permissionData) => {
  try {
    const response = await axiosClient.post('/permissions', permissionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Thêm quyền hạn thất bại');
  }
};

// API cập nhật quyền hạn
export const updatePermission = async (permissionId, permissionData) => {
  try {
    const response = await axiosClient.put(`/permissions/${permissionId}`, permissionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Cập nhật quyền hạn thất bại');
  }
};

// API xóa quyền hạn
export const deletePermission = async (permissionId) => {
  try {
    const response = await axiosClient.delete(`/permissions/${permissionId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Xóa quyền hạn thất bại');
  }
};
// API cấp quyền cho người dùng
export const assignPermission = async (userId, permissionData) => {
  try {
    const response = await axiosClient.post(`/permission/assign/${userId}`, permissionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Cấp quyền cho người dùng thất bại');
  }
};
