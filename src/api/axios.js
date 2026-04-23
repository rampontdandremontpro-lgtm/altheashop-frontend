import axios from "axios";

const api = axios.create({
  baseURL: "http://10.111.0.106:3001/api",
  timeout: 10000,
  withCredentials: true,
});

export default api;