const ADMIN_PRODUCTS_KEY = "althea_admin_products";

function getStoredProducts() {
  const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveProducts(products) {
  localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
}

function buildDefaultProducts() {
  return [
    {
      id: 1001,
      name: "Tensiomètre électronique bras",
      slug: "tensiometre-bras",
      shortDescription: "Mesure précise de la tension artérielle.",
      description:
        "Tensiomètre automatique avec écran LCD, mémoire intégrée et détection des battements irréguliers.",
      techSpecs: "Mesure automatique, mémoire 90 valeurs, écran LCD",
      priceCents: 4999,
      stock: 25,
      categoryName: "Diagnostic",
      imageUrl: "https://placehold.co/800x500?text=Tensiometre",
      isActive: true,
      priority: 1,
    },
    {
      id: 1002,
      name: "Thermomètre infrarouge sans contact",
      slug: "thermometre-infrarouge",
      shortDescription: "Mesure rapide et sans contact.",
      description:
        "Thermomètre frontal infrarouge idéal pour enfants et adultes. Résultat en 1 seconde.",
      techSpecs: "Sans contact, écran rétroéclairé, alarme fièvre",
      priceCents: 2999,
      stock: 40,
      categoryName: "Diagnostic",
      imageUrl: "https://placehold.co/800x500?text=Thermometre",
      isActive: true,
      priority: 2,
    },
    {
      id: 1003,
      name: "Oxymètre de pouls",
      slug: "oxymetre-pouls",
      shortDescription: "Mesure du taux d’oxygène dans le sang.",
      description:
        "Oxymètre compact permettant de mesurer la saturation en oxygène et la fréquence cardiaque.",
      techSpecs: "SpO2, fréquence cardiaque, écran OLED",
      priceCents: 1999,
      stock: 30,
      categoryName: "Diagnostic",
      imageUrl: "https://placehold.co/800x500?text=Oxymetre",
      isActive: true,
      priority: 3,
    },
    {
      id: 1004,
      name: "Fauteuil roulant pliable",
      slug: "fauteuil-roulant",
      shortDescription: "Mobilité facilitée au quotidien.",
      description:
        "Fauteuil roulant léger et pliable, adapté à un usage intérieur et extérieur.",
      techSpecs: "Aluminium, pliable, poids max 120kg",
      priceCents: 19999,
      stock: 10,
      categoryName: "Mobilité",
      imageUrl: "https://placehold.co/800x500?text=Fauteuil+Roulant",
      isActive: true,
      priority: 4,
    },
    {
      id: 1005,
      name: "Glucomètre",
      slug: "glucometre",
      shortDescription: "Mesure du taux de glucose sanguin.",
      description:
        "Glucomètre simple d’utilisation avec bandelettes et mémoire intégrée.",
      techSpecs: "Résultat rapide, mémoire 100 mesures",
      priceCents: 2499,
      stock: 20,
      categoryName: "Diabète",
      imageUrl: "https://placehold.co/800x500?text=Glucometre",
      isActive: true,
      priority: 5,
    },
  ];
}

function ensureProducts() {
  const stored = getStoredProducts();
  if (stored && Array.isArray(stored)) return stored;

  const defaults = buildDefaultProducts();
  saveProducts(defaults);
  return defaults;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getAdminProducts() {
  return ensureProducts();
}

export async function getAdminProductById(id) {
  const products = ensureProducts();
  const product = products.find((item) => String(item.id) === String(id));

  if (!product) {
    throw new Error("Produit introuvable.");
  }

  return product;
}

export async function createAdminProduct(payload) {
  const products = ensureProducts();

  const newProduct = {
    id: Date.now(),
    name: payload.name,
    slug: payload.slug?.trim() ? payload.slug.trim() : slugify(payload.name),
    shortDescription: payload.shortDescription,
    description: payload.description,
    techSpecs: payload.techSpecs,
    priceCents: Number(payload.priceCents),
    stock: Number(payload.stock),
    categoryName: payload.categoryName,
    imageUrl: payload.imageUrl,
    isActive: payload.isActive,
    priority: Number(payload.priority || 0),
  };

  const updated = [newProduct, ...products];
  saveProducts(updated);

  return newProduct;
}

export async function updateAdminProduct(id, payload) {
  const products = ensureProducts();

  const updated = products.map((product) => {
    if (String(product.id) !== String(id)) return product;

    return {
      ...product,
      name: payload.name,
      slug: payload.slug?.trim() ? payload.slug.trim() : slugify(payload.name),
      shortDescription: payload.shortDescription,
      description: payload.description,
      techSpecs: payload.techSpecs,
      priceCents: Number(payload.priceCents),
      stock: Number(payload.stock),
      categoryName: payload.categoryName,
      imageUrl: payload.imageUrl,
      isActive: payload.isActive,
      priority: Number(payload.priority || 0),
    };
  });

  saveProducts(updated);

  return updated.find((product) => String(product.id) === String(id));
}

export async function deleteAdminProduct(id) {
  const products = ensureProducts();
  const updated = products.filter((product) => String(product.id) !== String(id));
  saveProducts(updated);
  return true;
}