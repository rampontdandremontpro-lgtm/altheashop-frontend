import { useEffect, useState } from "react";
import { getAdminCategories } from "../../api/adminApi";

function toEuros(priceCents) {
  if (priceCents === undefined || priceCents === null || priceCents === "") {
    return "";
  }

  return (Number(priceCents) / 100).toFixed(2);
}

function ProductAdminForm({
  initialValues,
  onSubmit,
  submitLabel = "Enregistrer",
  loading = false,
}) {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    sku: initialValues?.sku || "",
    name: initialValues?.name || "",
    slug: initialValues?.slug || "",
    shortDescription: initialValues?.shortDescription || "",
    description: initialValues?.description || "",
    techSpecs: initialValues?.techSpecs || "",
    priceEuros: toEuros(initialValues?.priceCents),
    stock: initialValues?.stock || "",
    categoryId: initialValues?.categoryId || "",
    imageUrl: initialValues?.imageUrl || "",
    priority: initialValues?.priority || 0,
    isActive: initialValues?.isActive ?? true,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getAdminCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    if (!initialValues) return;

    setForm({
      sku: initialValues.sku || "",
      name: initialValues.name || "",
      slug: initialValues.slug || "",
      shortDescription: initialValues.shortDescription || "",
      description: initialValues.description || "",
      techSpecs: initialValues.techSpecs || "",
      priceEuros: toEuros(initialValues.priceCents),
      stock: initialValues.stock || "",
      categoryId: initialValues.categoryId || "",
      imageUrl: initialValues.imageUrl || "",
      priority: initialValues.priority || 0,
      isActive: initialValues.isActive ?? true,
    });
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.name ||
      !form.shortDescription ||
      !form.description ||
      !form.priceEuros ||
      !form.stock ||
      !form.categoryId
    ) {
      setError("Merci de remplir les champs obligatoires.");
      return;
    }

    await onSubmit(form);
  };

  return (
    <div className="box">
      <h2>Informations produit</h2>

      {error && <div className="box error-box">{error}</div>}

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
        />

        <input
          type="text"
          name="name"
          placeholder="Nom du produit"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="slug"
          placeholder="Slug optionnel"
          value={form.slug}
          onChange={handleChange}
        />

        <select name="categoryId" value={form.categoryId} onChange={handleChange}>
          <option value="">Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="priceEuros"
          placeholder="Prix en euros exemple : 399,00 ou 39,99"
          value={form.priceEuros}
          onChange={handleChange}
          min="0"
          step="0.01"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          min="0"
        />

        <input
          type="number"
          name="priority"
          placeholder="Priorité"
          value={form.priority}
          onChange={handleChange}
          min="0"
        />

        <input
          type="text"
          name="imageUrl"
          placeholder="URL image principale"
          value={form.imageUrl}
          onChange={handleChange}
        />

        <textarea
          name="shortDescription"
          placeholder="Description courte"
          value={form.shortDescription}
          onChange={handleChange}
          rows="3"
          className="contact-textarea"
        />

        <textarea
          name="description"
          placeholder="Description complète"
          value={form.description}
          onChange={handleChange}
          rows="5"
          className="contact-textarea"
        />

        <textarea
          name="techSpecs"
          placeholder="Caractéristiques techniques"
          value={form.techSpecs}
          onChange={handleChange}
          rows="4"
          className="contact-textarea"
        />

        <label className="settings-item">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Produit actif
        </label>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : submitLabel}
        </button>
      </form>
    </div>
  );
}

export default ProductAdminForm;