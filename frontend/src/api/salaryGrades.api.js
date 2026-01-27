// src/api/salaryGrades.api.js
import axiosClient from './axiosClient';

// API lấy danh sách bảng lương
export const getSalaryGrades = async () => {
  try {
    const response = await axiosClient.get('/salaryGrades');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lấy danh sách bảng lương thất bại');
  }
};

// API thêm bảng lương
export const addSalaryGrade = async (salaryGradeData) => {
  try {
    const response = await axiosClient.post('/salaryGrades', salaryGradeData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Thêm bảng lương thất bại');
  }
};

// API cập nhật bảng lương
export const updateSalaryGrade = async (salaryGradeId, salaryGradeData) => {
  try {
    const response = await axiosClient.put(`/salaryGrades/${salaryGradeId}`, salaryGradeData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Cập nhật bảng lương thất bại');
  }
};

// API xóa bảng lương
export const deleteSalaryGrade = async (salaryGradeId) => {
  try {
    const response = await axiosClient.delete(`/salaryGrades/${salaryGradeId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Xóa bảng lương thất bại');
  }
};
