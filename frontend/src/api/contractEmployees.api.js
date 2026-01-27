// src/api/contractEmployees.api.js
import axiosClient from './axiosClient';

// API lấy danh sách nhân viên hợp đồng
export const getContractEmployees = async () => {
  try {
    const response = await axiosClient.get('/contractEmployees');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lấy danh sách nhân viên hợp đồng thất bại');
  }
};

// API thêm nhân viên hợp đồng
export const addContractEmployee = async (employeeData) => {
  try {
    const response = await axiosClient.post('/contractEmployees', employeeData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Thêm nhân viên hợp đồng thất bại');
  }
};

// API cập nhật nhân viên hợp đồng
export const updateContractEmployee = async (employeeId, employeeData) => {
  try {
    const response = await axiosClient.put(`/contractEmployees/${employeeId}`, employeeData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Cập nhật nhân viên hợp đồng thất bại');
  }
};

// API xóa nhân viên hợp đồng
export const deleteContractEmployee = async (employeeId) => {
  try {
    const response = await axiosClient.delete(`/contractEmployees/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Xóa nhân viên hợp đồng thất bại');
  }
};
