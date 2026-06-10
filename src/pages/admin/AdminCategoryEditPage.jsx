import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CategoryAdminForm from "../../components/admin/CategoryAdminForm";
import {
  getAdminCategories,
  updateAdminCategory,
  uploadAdminCategoryImage,
} from "../../api/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function AdminCategoryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadCategory() {
    const categories = await getAdminCategories();

    const foundCategory = categories.find(
      (item) => Number(item.id) === Number(id)
    );

    if (!foundCategory) {
      throw new Error("Catégorie introuvable.");
    }

    setCategory(foundCategory);
  }

  useEffect(() => {
    async function loadPageData() {
      try {
        setLoadingPage(true);
        setError("");

        await loadCategory();
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Impossible de charger la catégorie."
        );
      } finally {
        setLoadingPage(false);
      }
    }

    loadPageData();
  }, [id]);

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateAdminCategory(id, formData);
      navigate("/admin/categories");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de modifier la catégorie."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Merci de choisir un fichier image.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const updatedCategory = await uploadAdminCategoryImage(id, file);

      setCategory((prev) => ({
        ...prev,
        ...updatedCategory,
      }));

      setSuccess("Image de la catégorie envoyée avec succès.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible d'envoyer l'image de la catégorie."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (loadingPage) return <Loader text="Chargement de la catégorie..." />;
  if (error && !category) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Modifier une catégorie</h1>
            <p>Édition d’une catégorie côté interface admin.</p>
          </div>

          <Link to="/admin/categories" className="btn btn-secondary">
            Retour catégories
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}
        {success && <div className="box success-box">{success}</div>}

        <div className="box admin-upload-box">
          <h2>Image de la catégorie</h2>

          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="admin-category-preview-image"
            />
          ) : (
            <p>Aucune image pour cette catégorie.</p>
          )}

          <label className="btn btn-secondary admin-file-label">
            {uploading ? "Envoi en cours..." : "Choisir une image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              hidden
            />
          </label>

          <p className="form-help-text">
            L’image sera utilisée côté catalogue et accueil si la catégorie est
            affichée.
          </p>
        </div>

        <CategoryAdminForm
          initialValues={category}
          onSubmit={handleSave}
          submitLabel="Enregistrer les modifications"
          loading={saving}
        />
      </section>
    </div>
  );
}

export default AdminCategoryEditPage;