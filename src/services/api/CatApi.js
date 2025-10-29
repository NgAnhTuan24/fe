import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/cat`;

export const getCats = () => axios.get(API_URL);

export const getCatById = (id) => axios.get(`${API_URL}/${id}`);

export const createCat = (cat) => axios.post(API_URL, cat);

export const updateCat = (id, cat) => axios.put(`${API_URL}/${id}`, cat);

export const deleteCat = (id) => axios.delete(`${API_URL}/${id}`);

export const getFeaturedCats = () => axios.get(`${API_URL}/featured`);

export const getCatsPaged = (page = 0, size = 10, search = "") =>
  axios.get(`${API_URL}/paged?page=${page}&size=${size}&search=${search}`);

// ----- Thêm hàm upload ảnh lên Cloudinary -----
export const uploadImageToCloudinary = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "CatHouse"); // tạo preset unsigned trên Cloudinary
  formData.append("folder", "cats"); // folder optional

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/dr7qomlvx/image/upload`,
      formData
    );
    return res.data.secure_url; // URL ảnh trả về
  } catch (err) {
    console.error("Upload Cloudinary lỗi:", err);
    throw err;
  }
};
