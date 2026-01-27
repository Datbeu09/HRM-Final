// src/api/attendanceLog.api.js
import axiosClient from './axiosClient';

// API lấy danh sách log điểm danh
export const getAttendanceLogs = async () => {
  try {
    const response = await axiosClient.get('/attendanceLog');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lấy danh sách log điểm danh thất bại');
  }
};

// API lấy log điểm danh theo id
export const getAttendanceLogById = async (id) => {
  try {
    const response = await axiosClient.get(`/attendanceLog/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lấy log điểm danh thất bại');
  }
};

// API thêm log điểm danh
export const addAttendanceLog = async (logData) => {
  try {
    const response = await axiosClient.post('/attendanceLog', logData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Thêm log điểm danh thất bại');
  }
};

// API cập nhật log điểm danh
export const updateAttendanceLog = async (logId, logData) => {
  try {
    const response = await axiosClient.put(`/attendanceLog/${logId}`, logData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Cập nhật log điểm danh thất bại');
  }
};

// API xóa log điểm danh
export const deleteAttendanceLog = async (logId) => {
  try {
    const response = await axiosClient.delete(`/attendanceLog/${logId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Xóa log điểm danh thất bại');
  }
};
