// src/api/accounts.api.js
import axios from "axios";

const getAuthToken = () => localStorage.getItem("token");

const getHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getUserList = async () => {
  const response = await axios.get("/api/accounts", {
    headers: getHeaders(),
  });

  // Controller trả { success:true, data:[...] }
  return response.data?.data || [];
};

export const addUser = async (user) => {
  const response = await axios.post("/api/accounts", user, {
    headers: getHeaders(),
  });
  return response.data?.data;
};

export const updateUser = async (user) => {
  const response = await axios.put(`/api/accounts/${user.id}`, user, {
    headers: getHeaders(),
  });
  return response.data?.data;
};

export const deleteUser = async (id) => {
  await axios.delete(`/api/accounts/${id}`, {
    headers: getHeaders(),
  });
};
