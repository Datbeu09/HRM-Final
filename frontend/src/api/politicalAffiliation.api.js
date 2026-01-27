// src/api/politicalAffiliation.api.js
const axiosClient = require('./axiosClient');

// GET all political affiliations
const getAllPoliticalAffiliations = async () => {
  try {
    const response = await axiosClient.get('/politicalAffiliations');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch political affiliations');
  }
};

// GET political affiliation by ID
const getPoliticalAffiliationById = async (id) => {
  try {
    const response = await axiosClient.get(`/politicalAffiliations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch political affiliation');
  }
};

// POST create a new political affiliation
const createPoliticalAffiliation = async (politicalAffiliation) => {
  try {
    const response = await axiosClient.post('/politicalAffiliations', politicalAffiliation);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create political affiliation');
  }
};

// PUT update an existing political affiliation
const updatePoliticalAffiliation = async (id, politicalAffiliation) => {
  try {
    const response = await axiosClient.put(`/politicalAffiliations/${id}`, politicalAffiliation);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update political affiliation');
  }
};

// DELETE political affiliation
const deletePoliticalAffiliation = async (id) => {
  try {
    const response = await axiosClient.delete(`/politicalAffiliations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete political affiliation');
  }
};

module.exports = {
  getAllPoliticalAffiliations,
  getPoliticalAffiliationById,
  createPoliticalAffiliation,
  updatePoliticalAffiliation,
  deletePoliticalAffiliation,
};
