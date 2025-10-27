import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const login = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const register = async (data) => {
  return axios.post(`${API_URL}/register`, data);
};

export const logoutApi = async (userId) => {
  const res = await axios.post(`${API_URL}/logout`, { userId });
  return res.data;
};
