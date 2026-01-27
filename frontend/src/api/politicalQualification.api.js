// src/api/politicalQualification.api.js
const axiosClient = require('./axiosClient');

// GET all political qualifications
const getAllPoliticalQualifications = async () => {
  try {
    const response = await axiosClient.get('/politicalQualifications');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch political qualifications');
  }
};

// GET political qualification by ID
const getPoliticalQualificationById = async (id) => {
  try {
    const response = await axiosClient.get(`/politicalQualifications/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch political qualification');
  }
};

// POST create a new political qualification
const createPoliticalQualification = async (politicalQualification) => {
  try {
    const response = await axiosClient.post('/politicalQualifications', politicalQualification);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create political qualification');
  }
};

// PUT update an existing political qualification
const updatePoliticalQualification = async (id, politicalQualification) => {
  try {
    const response = await axiosClient.put(`/politicalQualifications/${id}`, politicalQualification);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update political qualification');
  }
};

// DELETE political qualification
const deletePoliticalQualification = async (id) => {
  try {
    const response = await axiosClient.delete(`/politicalQualifications/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete political qualification');
  }
};

module.exports = {
  getAllPoliticalQualifications,
  getPoliticalQualificationById,
  createPoliticalQualification,
  updatePoliticalQualification,
  deletePoliticalQualification,
};
