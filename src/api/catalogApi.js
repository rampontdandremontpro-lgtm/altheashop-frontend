import api, { resolveImageUrl } from "./axios";

function normalizeImage(image) {
  if (!image) return null;

  const rawUrl = image.url || image.imageUrl || "";
  const url = resolveImageUrl(rawUrl);

  return {
    id: image.id,
    url,
    imageUrl: url,
    altText: image.alt || image.altText || "",
    displayOrder: image.displayOrder ?? 0,
  };
}

function normalizeTranslations(translations) {
  return Array.isArray(translations) ? translations : [];
}

function normalizeCategory(category) {
  if (!category) return null;

  return {
    id: category.id,
    name: category.name || "",
    slug: category.slug || "",
    description: category.description || "",
    imageUrl: resolveImageUrl(category.imageUrl || ""),
    displayOrder: category.displayOrder ?? 0,
    translations: normalizeTranslations(category.translations),
  };
}

function normalizeTechSpecs(techSpecs) {
  if (!techSpecs) return "";

  if (typeof techSpecs === "string") {
    return techSpecs;
  }

  return techSpecs.content || "";
}

function normalizeProduct(product) {
  if (!product) return null;

  const normalizedImages = Array.isArray(product.images)
    ? product.images.map(normalizeImage).filter(Boolean)
    : [];

  const mainImageUrl =
    resolveImageUrl(product.imageUrl || "") ||
    normalizedImages[0]?.url ||
    normalizedImages[0]?.imageUrl ||
    "";

  return {
    id: product.id,
    sku: product.sku || "",
    name: product.name || "",
    slug: product.slug || "",
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    techSpecs: normalizeTechSpecs(product.techSpecs),
    priceCents: product.priceCents ?? 0,
    stock: product.stock ?? 0,
    priority: product.priority ?? 0,
    isActive: Boolean(product.isActive),
    isFeatured: Boolean(product.isFeatured),
    categoryId: product.categoryId ?? product.category?.id ?? null,
    category: normalizeCategory(product.category),
    imageUrl: mainImageUrl,
    images: normalizedImages,
    translations: normalizeTranslations(product.translations),
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
    imageUrl: resolveImageUrl(slide.imageUrl || ""),
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
    if (
      value !== "" &&
      value !== null &&
      value !== undefined &&
      value !== false
    ) {
      cleanParams[key] = value;
    }
  });

  const response = await api.get("/catalog/products", {
    params: cleanParams,
  });

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

export async function getProductById(identifier) {
  const response = await api.get(`/catalog/products/${identifier}`);
  return normalizeProduct(response.data);
}