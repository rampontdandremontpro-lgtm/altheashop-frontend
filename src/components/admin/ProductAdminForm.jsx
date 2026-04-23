import { useState } from "react";

function ProductAdminForm({
  initialValues,
  onSubmit,
  submitLabel = "Enregistrer",
  loading = false,
}) {
  const [form, setForm] = useState({
    name: initialValues?.name || "",
    slug: initialValues?.slug || "",
    shortDescription: initialValues?.shortDescription || "",
    description: initialValues?.description || "",
    techSpecs: initialValues?.techSpecs || "",
    priceCents: initialValues?.priceCents || "",
    stock: initialValues?.stock || "",
    categoryName: initialValues?.categoryName || "",
    imageUrl: initialValues?.imageUrl || "",
    priority: initialValues?.priority || 0,
    isActive: initialValues?.isActive ?? true,
  });

  const [error, setError] = useState("");

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
      !form.priceCents ||
      !form.stock ||
      !form.categoryName
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
          name="name"
          placeholder="Nom du produit"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="slug"
          placeholder="Slug (optionnel)"
          value={form.slug}
          onChange={handleChange}
        />

        <input
          type="text"
          name="categoryName"
          placeholder="Catégorie"
          value={form.categoryName}
          onChange={handleChange}
        />

        <input
          type="number"
          name="priceCents"
          placeholder="Prix en centimes"
          value={form.priceCents}
          onChange={handleChange}
          min="0"
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
          placeholder="URL image"
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