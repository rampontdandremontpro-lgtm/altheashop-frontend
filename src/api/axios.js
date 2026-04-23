import axios from "axios";

const api = axios.create({
  baseURL: "http://10.111.0.106:3001/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("althea_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;