import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/auth`;

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
