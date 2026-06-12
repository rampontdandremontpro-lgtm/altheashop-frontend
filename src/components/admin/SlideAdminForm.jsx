import { useEffect, useState } from "react";

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  imageUrl: "",
  ctaLabel: "",
  ctaUrl: "",
  displayOrder: 0,
  isActive: true,
};

function SlideAdminForm({
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
      title: initialValues.title || "",
      subtitle: initialValues.subtitle || "",
      imageUrl: initialValues.imageUrl || "",
      ctaLabel: initialValues.ctaLabel || "",
      ctaUrl: initialValues.ctaUrl || "",
      displayOrder: initialValues.displayOrder ?? 0,
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

    if (!form.title) {
  setError("Le titre est obligatoire.");
}

    await onSubmit(form);
  };

  return (
    <div className="box">
      <h2>Informations slide</h2>

      {error && <div className="box error-box">{error}</div>}

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Titre du slide"
          value={form.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="subtitle"
          placeholder="Sous-titre"
          value={form.subtitle}
          onChange={handleChange}
        />

        <input
          type="text"
          name="ctaLabel"
          placeholder="Texte du bouton"
          value={form.ctaLabel}
          onChange={handleChange}
        />

        <input
          type="text"
          name="ctaUrl"
          placeholder="Lien du bouton, exemple : /catalog"
          value={form.ctaUrl}
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

        <label className="settings-item">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Slide actif
        </label>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : submitLabel}
        </button>
      </form>
    </div>
  );
}

export default SlideAdminForm;