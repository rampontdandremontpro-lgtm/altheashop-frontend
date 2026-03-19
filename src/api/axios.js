import axios from "axios";

const api = axios.create({
  baseURL: "http://10.111.0.181:3001/api",
  timeout: 10000,
});

export default api;