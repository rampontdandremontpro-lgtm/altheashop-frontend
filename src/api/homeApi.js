import api from "./axios";

function normalizeSlide(slide) {
  return {
    id: slide.id,
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    imageUrl: slide.imageUrl || "",
    ctaLabel: slide.ctaLabel || "",
    ctaUrl: slide.ctaUrl || "",
    displayOrder: slide.displayOrder ?? 0,
    isActive: Boolean(slide.isActive),
  };
}

export async function getPublicHomeData() {
  const response = await api.get("/catalog/home");
  const data = response.data;

  return {
    slides: Array.isArray(data?.slides) ? data.slides.map(normalizeSlide) : [],
    homeText: data?.homeText || "",
    categories: Array.isArray(data?.categories) ? data.categories : [],
    featured: Array.isArray(data?.featured) ? data.featured : [],
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
    imageUrl: payload.imageUrl,
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
    imageUrl: payload.imageUrl,
    ctaLabel: payload.ctaLabel || "",
    ctaUrl: payload.ctaUrl || "",
    displayOrder: Number(payload.displayOrder || 0),
    isActive: Boolean(payload.isActive),
  });

  return normalizeSlide(response.data);
}

export async function deleteAdminSlide(id) {
  await api.delete(`/admin/slides/${id}`);
  return true;
}