import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SlideAdminForm from "../../components/admin/SlideAdminForm";
import { createAdminSlide, uploadAdminSlideImage } from "../../api/homeApi";

function AdminSlideCreatePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Merci de choisir un fichier image.");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
  };

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      setError("");

      const createdSlide = await createAdminSlide(formData);

      if (selectedImage) {
        await uploadAdminSlideImage(createdSlide.id, selectedImage);
      }

      navigate("/admin/home");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de créer le slide."
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
            <h1>Créer un slide</h1>
            <p>Ajout d’un nouveau slide pour le carrousel d’accueil.</p>
          </div>

          <Link to="/admin/home" className="btn btn-secondary">
            Retour accueil
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}

        <div className="box admin-upload-box">
          <h2>Image du slide</h2>

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Aperçu du slide"
              className="admin-product-preview-image"
            />
          ) : (
            <p>Aucune image sélectionnée.</p>
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

        <SlideAdminForm
          onSubmit={handleCreate}
          submitLabel="Créer le slide"
          loading={loading}
        />
      </section>
    </div>
  );
}

export default AdminSlideCreatePage;