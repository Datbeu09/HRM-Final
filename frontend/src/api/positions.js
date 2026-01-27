// src/api/positions.api.js
const axiosClient = require('./axiosClient');

// GET all positions
const getAllPositions = async () => {
  try {
    const response = await axiosClient.get('/positions');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch positions');
  }
};

// GET position by ID
const getPositionById = async (id) => {
  try {
    const response = await axiosClient.get(`/positions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch position');
  }
};

// POST create a new position
const createPosition = async (position) => {
  try {
    const response = await axiosClient.post('/positions', position);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create position');
  }
};

// PUT update an existing position
const updatePosition = async (id, position) => {
  try {
    const response = await axiosClient.put(`/positions/${id}`, position);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update position');
  }
};

// DELETE position
const deletePosition = async (id) => {
  try {
    const response = await axiosClient.delete(`/positions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete position');
  }
};

module.exports = {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
};
