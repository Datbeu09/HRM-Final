// src/api/assignment.api.js
import axiosClient from './axiosClient';

// API lấy danh sách bài tập
export const getAssignments = async () => {
  try {
    const response = await axiosClient.get('/assignments');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lấy danh sách bài tập thất bại');
  }
};

// API lấy thông tin bài tập theo id
export const getAssignmentById = async (id) => {
  try {
    const response = await axiosClient.get(`/assignments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lấy thông tin bài tập thất bại');
  }
};

// API thêm bài tập mới
export const addAssignment = async (assignmentData) => {
  try {
    const response = await axiosClient.post('/assignments', assignmentData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Thêm bài tập thất bại');
  }
};

// API cập nhật thông tin bài tập
export const updateAssignment = async (assignmentId, assignmentData) => {
  try {
    const response = await axiosClient.put(`/assignments/${assignmentId}`, assignmentData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Cập nhật bài tập thất bại');
  }
};

// API xóa bài tập
export const deleteAssignment = async (assignmentId) => {
  try {
    const response = await axiosClient.delete(`/assignments/${assignmentId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Xóa bài tập thất bại');
  }
};
