import api from "./axios";

function normalizeImage(image) {
  if (!image) return null;

  return {
    id: image.id,
    imageUrl: image.url || image.imageUrl || "",
    altText: image.alt || image.altText || "",
    displayOrder: image.displayOrder ?? 0,
  };
}

function normalizeCategory(category) {
  if (!category) return null;

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    imageUrl: category.imageUrl || "",
    displayOrder: category.displayOrder ?? 0,
  };
}

function normalizeProduct(product) {
  if (!product) return null;

  return {
    id: product.id,
    sku: product.sku || "",
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    techSpecs: product.techSpecs || "",
    priceCents: product.priceCents ?? 0,
    stock: product.stock ?? 0,
    priority: product.priority ?? 0,
    isActive: Boolean(product.isActive),
    categoryId: product.categoryId ?? product.category?.id ?? null,
    category: normalizeCategory(product.category),
    images: Array.isArray(product.images)
      ? product.images.map(normalizeImage)
      : [],
    createdAt: product.createdAt || null,
    updatedAt: product.updatedAt || null,
  };
}

function normalizeSlide(slide) {
  if (!slide) return null;

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

export async function getHomeData() {
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

export async function getCategories() {
  const response = await api.get("/catalog/categories");
  const data = response.data;

  return Array.isArray(data) ? data.map(normalizeCategory) : [];
}

export async function getCategoryBySlug(slug) {
  const response = await api.get(`/catalog/categories/${slug}`);
  return normalizeCategory(response.data);
}

export async function getProducts(params = {}) {
  const cleanParams = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined && value !== false) {
      cleanParams[key] = value;
    }
  });

  const response = await api.get("/catalog/products", { params: cleanParams });
  const data = response.data;

  return {
    items: Array.isArray(data?.items) ? data.items.map(normalizeProduct) : [],
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? 12,
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 1,
  };
}

export async function getProductBySlug(slug) {
  const response = await api.get(`/catalog/products/${slug}`);
  return normalizeProduct(response.data);
}