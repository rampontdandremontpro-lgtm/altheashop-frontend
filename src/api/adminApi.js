import api from "./axios";

function normalizeProduct(product) {
  const firstImageUrl =
    product.imageUrl ||
    product.images?.[0]?.url ||
    product.images?.[0]?.imageUrl ||
    "";

  return {
    id: product.id,
    sku: product.sku || "",
    name: product.name || "",
    slug: product.slug || "",
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    techSpecs:
      typeof product.techSpecs === "string"
        ? product.techSpecs
        : product.techSpecs?.content || "",
    priceCents: product.priceCents ?? 0,
    stock: product.stock ?? 0,
    priority: product.priority ?? 0,
    isActive: Boolean(product.isActive),
    isFeatured: Boolean(product.isFeatured),
    categoryId: product.categoryId ?? product.category?.id ?? "",
    categoryName: product.category?.name || "",
    category: product.category || null,
    imageUrl: firstImageUrl,
    images: product.images || [],
  };
}

function normalizePayload(payload) {
  return {
    sku: payload.sku || undefined,
    name: payload.name,
    slug: payload.slug || undefined,
    shortDescription: payload.shortDescription,
    description: payload.description,
    techSpecs: payload.techSpecs || "",
    priceCents: Math.round(
      Number(String(payload.priceEuros).replace(",", ".")) * 100
    ),
    stock: Number(payload.stock),
    priority: Number(payload.priority || 0),
    isActive: Boolean(payload.isActive),
    isFeatured: Boolean(payload.isFeatured),
    categoryId: Number(payload.categoryId),
    imageUrl: payload.imageUrl || "",
  };
}

export async function getAdminStats() {
  const response = await api.get("/admin/stats");
  return response.data;
}

export async function getAdminCategories() {
  const response = await api.get("/admin/categories");
  return response.data;
}

export async function getAdminProducts() {
  const response = await api.get("/admin/products");
  const data = response.data;

  if (Array.isArray(data)) return data.map(normalizeProduct);
  if (Array.isArray(data.items)) return data.items.map(normalizeProduct);

  return [];
}

export async function getAdminProductById(id) {
  const response = await api.get(`/admin/products/${id}`);
  return normalizeProduct(response.data);
}

export async function createAdminProduct(payload) {
  const response = await api.post("/admin/products", normalizePayload(payload));
  return normalizeProduct(response.data);
}

export async function updateAdminProduct(id, payload) {
  const response = await api.patch(
    `/admin/products/${id}`,
    normalizePayload(payload)
  );

  return normalizeProduct(response.data);
}

export async function deleteAdminProduct(id) {
  await api.delete(`/admin/products/${id}`);
  return true;
}

export async function uploadAdminProductImage(productId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(`/admin/products/${productId}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return normalizeProduct(response.data);
}