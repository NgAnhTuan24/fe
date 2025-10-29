import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/user`;

export const getUsers = () => axios.get(API_URL).then((res) => res.data);

export const getUserById = (id) =>
  axios.get(`${API_URL}/${id}`).then((res) => res.data);

export const createUser = (user) =>
  axios.post(API_URL, user).then((res) => res.data);

export const updateUser = (id, updateData) =>
  axios.put(`${API_URL}/${id}`, updateData).then((res) => res.data);

export const changePassword = (id, passwordData) =>
  axios.put(`${API_URL}/${id}/password`, passwordData).then((res) => res.data);

export const getUsersPaged = (page = 0, size = 10, search = "") =>
  axios
    .get(
      `${API_URL}/paged?page=${page}&size=${size}&search=${encodeURIComponent(
        search
      )}`
    )
    .then((res) => res.data);
