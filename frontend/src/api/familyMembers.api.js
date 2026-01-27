// src/api/familyMembers.api.js
import axiosClient from './axiosClient';

// Lấy danh sách thành viên gia đình của nhân viên
export const getFamilyMembers = async (employeeId) => {
  try {
    const response = await axiosClient.get(`/family-members/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lỗi khi lấy thành viên gia đình');
  }
};

// Lấy thành viên gia đình theo ID
export const getFamilyMemberById = async (id) => {
  try {
    const response = await axiosClient.get(`/family-members/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lỗi khi lấy thành viên gia đình');
  }
};

// Tạo thành viên gia đình mới
export const createFamilyMember = async (familyMemberData) => {
  try {
    const response = await axiosClient.post('/family-members', familyMemberData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lỗi khi tạo thành viên gia đình');
  }
};

// Cập nhật thành viên gia đình
export const updateFamilyMember = async (id, familyMemberData) => {
  try {
    const response = await axiosClient.put(`/family-members/${id}`, familyMemberData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lỗi khi cập nhật thành viên gia đình');
  }
};

// Xóa thành viên gia đình
export const deleteFamilyMember = async (id) => {
  try {
    const response = await axiosClient.delete(`/family-members/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lỗi khi xóa thành viên gia đình');
  }
};
