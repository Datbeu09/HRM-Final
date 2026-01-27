// src/api/benefits.api.js
import axiosClient from './axiosClient';

// API lấy danh sách quyền lợi
export const getBenefits = async () => {
  try {
    const response = await axiosClient.get('/benefits');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Lấy danh sách quyền lợi thất bại');
  }
};

// API thêm quyền lợi
export const addBenefit = async (benefitData) => {
  try {
    const response = await axiosClient.post('/benefits', benefitData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Thêm quyền lợi thất bại');
  }
};

// API cập nhật quyền lợi
export const updateBenefit = async (benefitId, benefitData) => {
  try {
    const response = await axiosClient.put(`/benefits/${benefitId}`, benefitData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Cập nhật quyền lợi thất bại');
  }
};

// API xóa quyền lợi
export const deleteBenefit = async (benefitId) => {
  try {
    const response = await axiosClient.delete(`/benefits/${benefitId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Xóa quyền lợi thất bại');
  }
};
