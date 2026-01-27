// src/api/professionalQualifications.api.js
const axiosClient = require('./axiosClient');

// GET all professional qualifications
const getAllProfessionalQualifications = async () => {
  try {
    const response = await axiosClient.get('/professionalQualifications');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch professional qualifications');
  }
};

// GET professional qualification by ID
const getProfessionalQualificationById = async (id) => {
  try {
    const response = await axiosClient.get(`/professionalQualifications/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch professional qualification');
  }
};

// POST create a new professional qualification
const createProfessionalQualification = async (professionalQualification) => {
  try {
    const response = await axiosClient.post('/professionalQualifications', professionalQualification);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create professional qualification');
  }
};

// PUT update an existing professional qualification
const updateProfessionalQualification = async (id, professionalQualification) => {
  try {
    const response = await axiosClient.put(`/professionalQualifications/${id}`, professionalQualification);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update professional qualification');
  }
};

// DELETE professional qualification
const deleteProfessionalQualification = async (id) => {
  try {
    const response = await axiosClient.delete(`/professionalQualifications/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete professional qualification');
  }
};

module.exports = {
  getAllProfessionalQualifications,
  getProfessionalQualificationById,
  createProfessionalQualification,
  updateProfessionalQualification,
  deleteProfessionalQualification,
};
