import { useEffect, useState } from "react";

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  displayOrder: 0,
  isActive: true,
};

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CategoryAdminForm({
  initialValues,
  onSubmit,
  submitLabel = "Enregistrer",
  loading = false,
}) {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    ...initialValues,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialValues) return;

    setForm({
      name: initialValues.name || "",
      slug: initialValues.slug || "",
      description: initialValues.description || "",
      imageUrl: initialValues.imageUrl || "",
      displayOrder: initialValues.displayOrder ?? 0,
      isActive: initialValues.isActive ?? true,
    });
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "name" && !initialValues) {
        next.slug = slugify(value);
      }

      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.slug) {
      setError("Le nom et le slug sont obligatoires.");
      return;
    }

    await onSubmit(form);
  };

  return (
    <div className="box">
      <h2>Informations catégorie</h2>

      {error && <div className="box error-box">{error}</div>}

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nom de la catégorie"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="slug"
          placeholder="Slug"
          value={form.slug}
          onChange={handleChange}
        />

        <input
          type="number"
          name="displayOrder"
          placeholder="Ordre d'affichage"
          value={form.displayOrder}
          onChange={handleChange}
          min="0"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
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
          Catégorie active
        </label>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : submitLabel}
        </button>
      </form>
    </div>
  );
}

export default CategoryAdminForm;