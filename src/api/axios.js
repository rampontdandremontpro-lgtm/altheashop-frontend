import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export function resolveImageUrl(url) {
  if (!url) return "";

  if (url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsedUrl = new URL(url);

      return `${ASSET_BASE_URL}${parsedUrl.pathname}`;
    } catch {
      return url;
    }
  }

  return `${ASSET_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("althea_token") ||
    sessionStorage.getItem("althea_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;