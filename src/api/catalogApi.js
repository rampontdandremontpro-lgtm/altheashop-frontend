import api from "./axios";

export async function getHomeData() {
  const response = await api.get("/catalog/home");
  return response.data;
}

export async function getCategories() {
  const response = await api.get("/catalog/categories");
  return response.data;
}

export async function getProducts(params = {}) {
  const cleanParams = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined && value !== false) {
      cleanParams[key] = value;
    }
  });

  const response = await api.get("/catalog/products", { params: cleanParams });
  return response.data;
}

export async function getProductBySlug(slug) {
  const response = await api.get(`/catalog/products/${slug}`);
  return response.data;
}