import api, { resolveImageUrl } from "./axios";

function normalizeImage(image) {
  if (!image) return null;

  const url = resolveImageUrl(image.url || image.imageUrl || "");

  return {
    ...image,
    url,
    imageUrl: url,
    altText: image.altText || image.alt || "",
    displayOrder: Number(image.displayOrder ?? 0),
  };
}

function normalizeTranslations(translations) {
  return Array.isArray(translations) ? translations : [];
}

function normalizeProduct(product) {
  if (!product) return null;

  const normalizedImages = Array.isArray(product.images)
    ? product.images.map(normalizeImage).filter(Boolean)
    : [];

  const imageUrl =
    resolveImageUrl(product.imageUrl || "") ||
    normalizedImages[0]?.url ||
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
    imageUrl,
    images: normalizedImages,
    translations: normalizeTranslations(product.translations),
  };
}

function normalizeCategory(category) {
  return {
    ...category,
    imageUrl: resolveImageUrl(category?.imageUrl || ""),
    translations: normalizeTranslations(category?.translations),
  };
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePayload(payload) {
  const price = Number(String(payload.priceEuros).replace(",", "."));

  return {
    sku: payload.sku || `ALT-${Date.now()}`,
    name: payload.name,
    slug: payload.slug || slugify(payload.name),
    shortDescription: payload.shortDescription,
    description: payload.description,
    techSpecs: {
      content: payload.techSpecs || "",
    },
    priceCents: Math.round(price * 100),
    stock: Number(payload.stock),
    priority: Number(payload.priority || 0),
    isActive: Boolean(payload.isActive),
    isFeatured: Boolean(payload.isFeatured),
    categoryId: Number(payload.categoryId),
    imageUrl: payload.imageUrl || "",
  };
}

export async function getAdminStats(period = "7d") {
  const response = await api.get("/admin/stats", {
    params: { period },
  });

  return response.data;
}

export async function getAdminCategories() {
  const response = await api.get("/admin/categories");

  return Array.isArray(response.data)
    ? response.data.map(normalizeCategory)
    : [];
}

export async function createAdminCategory(payload) {
  const response = await api.post("/admin/categories", {
    name: payload.name,
    slug: payload.slug,
    description: payload.description || "",
    displayOrder: Number(payload.displayOrder || 0),
    isActive: Boolean(payload.isActive),
  });

  return normalizeCategory(response.data);
}

export async function updateAdminCategory(id, payload) {
  const response = await api.patch(`/admin/categories/${id}`, {
    name: payload.name,
    slug: payload.slug,
    description: payload.description || "",
    displayOrder: Number(payload.displayOrder || 0),
    isActive: Boolean(payload.isActive),
  });

  return normalizeCategory(response.data);
}

export async function deleteAdminCategory(id) {
  await api.delete(`/admin/categories/${id}`);
  return true;
}

export async function uploadAdminCategoryImage(categoryId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `/admin/categories/${categoryId}/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return normalizeCategory(response.data);
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

  const response = await api.post(
    `/admin/products/${productId}/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return normalizeProduct(response.data);
}

export async function getAdminProductImages(productId) {
  const response = await api.get(`/admin/products/${productId}/images`);

  return Array.isArray(response.data)
    ? response.data.map(normalizeImage).filter(Boolean)
    : [];
}

export async function uploadAdminProductGalleryImage(productId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `/admin/products/${productId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return normalizeImage(response.data);
}

export async function updateAdminProductGalleryImage(productId, imageId, payload) {
  const response = await api.patch(
    `/admin/products/${productId}/images/${imageId}`,
    {
      altText: payload.altText || "",
      displayOrder: Number(payload.displayOrder || 0),
    }
  );

  return normalizeImage(response.data);
}

export async function deleteAdminProductGalleryImage(productId, imageId) {
  await api.delete(`/admin/products/${productId}/images/${imageId}`);
  return true;
}

export async function getAdminProductTranslations(productId) {
  const response = await api.get(`/admin/products/${productId}/translations`);
  return Array.isArray(response.data) ? response.data : [];
}

export async function saveAdminProductTranslation(productId, payload) {
  const response = await api.post(
    `/admin/products/${productId}/translations`,
    {
      language: payload.language,
      name: payload.name || "",
      shortDescription: payload.shortDescription || "",
      description: payload.description || "",
      techSpecs: payload.techSpecs || {},
    }
  );

  return response.data;
}

export async function deleteAdminProductTranslation(productId, language) {
  await api.delete(`/admin/products/${productId}/translations/${language}`);
  return true;
}

export async function getAdminOrders() {
  const response = await api.get("/admin/orders");
  return Array.isArray(response.data) ? response.data : [];
}

export async function getAdminOrderById(id) {
  const response = await api.get(`/admin/orders/${id}`);
  return response.data;
}

export async function updateAdminOrderStatus(id, status) {
  const response = await api.patch(`/admin/orders/${id}/status`, {
    status,
  });

  return response.data;
}

export async function getAdminUsers() {
  const response = await api.get("/admin/users");
  return Array.isArray(response.data) ? response.data : [];
}

export async function getAdminUserById(id) {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
}

export async function updateAdminUser(id, payload) {
  const response = await api.patch(`/admin/users/${id}`, {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
    isActive: Boolean(payload.isActive),
  });

  return response.data;
}

export async function deleteAdminUser(id) {
  await api.delete(`/admin/users/${id}`);
  return true;
}

export async function getAdminChatbotMessages(page = 1, limit = 20) {
  const response = await api.get("/admin/chatbot/messages", {
    params: {
      page,
      limit,
    },
  });

  const data = response.data || {};

  return {
    items: Array.isArray(data.items) ? data.items : [],
    page: data.page ?? page,
    limit: data.limit ?? limit,
    total: data.total ?? 0,
    totalPages: data.totalPages ?? 1,
  };
}

export async function getAdminChatbotEscalations(page = 1, limit = 20) {
  const response = await api.get("/admin/chatbot/escalations", {
    params: { page, limit },
  });

  const data = response.data || {};

  return {
    items: Array.isArray(data.items) ? data.items : [],
    page: data.page ?? page,
    limit: data.limit ?? limit,
    total: data.total ?? 0,
    totalPages: data.totalPages ?? 1,
  };
}

export async function resolveAdminChatbotEscalation(id) {
  const response = await api.patch(`/admin/chatbot/escalations/${id}/resolve`);
  return response.data;
}