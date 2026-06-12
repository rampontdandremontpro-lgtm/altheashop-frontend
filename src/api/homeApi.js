import api, { resolveImageUrl } from "./axios";

function normalizeSlide(slide) {
  return {
    id: slide.id,
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    imageUrl: resolveImageUrl(slide.imageUrl || ""),
    ctaLabel: slide.ctaLabel || "",
    ctaUrl: slide.ctaUrl || "",
    displayOrder: slide.displayOrder ?? 0,
    isActive: Boolean(slide.isActive),
  };
}

function normalizeCategory(category) {
  return {
    ...category,
    imageUrl: resolveImageUrl(category.imageUrl || ""),
  };
}

function normalizeProduct(product) {
  const images = Array.isArray(product.images)
    ? product.images.map((image) => ({
        ...image,
        url: resolveImageUrl(image.url || image.imageUrl || ""),
        imageUrl: resolveImageUrl(image.url || image.imageUrl || ""),
      }))
    : [];

  return {
    ...product,
    imageUrl: resolveImageUrl(product.imageUrl || images[0]?.url || ""),
    images,
  };
}

export async function getPublicHomeData() {
  const response = await api.get("/catalog/home");
  const data = response.data;

  return {
    slides: Array.isArray(data?.slides) ? data.slides.map(normalizeSlide) : [],
    homeText: data?.homeText || "",
    categories: Array.isArray(data?.categories)
      ? data.categories.map(normalizeCategory)
      : [],
    featured: Array.isArray(data?.featured)
      ? data.featured.map(normalizeProduct)
      : [],
  };
}

export async function getAdminHome() {
  const response = await api.get("/admin/home");
  return response.data;
}

export async function updateAdminHome(payload) {
  const response = await api.patch("/admin/home", {
    homeText: payload.homeText,
  });

  return response.data;
}

export async function getAdminSlides() {
  const response = await api.get("/admin/slides");
  return Array.isArray(response.data) ? response.data.map(normalizeSlide) : [];
}

export async function createAdminSlide(payload) {
  const response = await api.post("/admin/slides", {
    title: payload.title,
    subtitle: payload.subtitle || "",
    ctaLabel: payload.ctaLabel || "",
    ctaUrl: payload.ctaUrl || "",
    displayOrder: Number(payload.displayOrder || 0),
    isActive: Boolean(payload.isActive),
  });

  return normalizeSlide(response.data);
}

export async function updateAdminSlide(id, payload) {
  const response = await api.patch(`/admin/slides/${id}`, {
    title: payload.title,
    subtitle: payload.subtitle || "",
    ctaLabel: payload.ctaLabel || "",
    ctaUrl: payload.ctaUrl || "",
    displayOrder: Number(payload.displayOrder || 0),
    isActive: Boolean(payload.isActive),
  });

  return normalizeSlide(response.data);
}

export async function uploadAdminSlideImage(slideId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(`/admin/slides/${slideId}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return normalizeSlide(response.data);
}

export async function deleteAdminSlide(id) {
  await api.delete(`/admin/slides/${id}`);
  return true;
}