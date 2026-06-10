import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CategoryAdminForm from "../../components/admin/CategoryAdminForm";
import {
  createAdminCategory,
  uploadAdminCategoryImage,
} from "../../api/adminApi";

function AdminCategoryCreatePage() {
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Merci de choisir un fichier image.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      setError("");

      const createdCategory = await createAdminCategory(formData);

      if (imageFile) {
        await uploadAdminCategoryImage(createdCategory.id, imageFile);
      }

      navigate("/admin/categories");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de créer la catégorie."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Créer une catégorie</h1>
            <p>Ajout d’une nouvelle catégorie côté interface admin.</p>
          </div>

          <Link to="/admin/categories" className="btn btn-secondary">
            Retour catégories
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}

        <div className="box admin-upload-box">
          <h2>Image de la catégorie</h2>

          <p className="form-help-text">
            Cette image sera utilisée côté catalogue et accueil si la catégorie
            est affichée.
          </p>

          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Aperçu catégorie"
              className="admin-category-preview-image"
            />
          ) : (
            <p>Aucune image choisie.</p>
          )}

          <label className="btn btn-secondary admin-file-label">
            Choisir une image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              hidden
            />
          </label>
        </div>

        <CategoryAdminForm
          onSubmit={handleCreate}
          submitLabel="Créer la catégorie"
          loading={loading}
        />
      </section>
    </div>
  );
}

export default AdminCategoryCreatePage;