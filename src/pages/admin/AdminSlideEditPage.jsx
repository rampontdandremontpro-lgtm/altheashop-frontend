import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SlideAdminForm from "../../components/admin/SlideAdminForm";
import {
  getAdminSlides,
  updateAdminSlide,
  uploadAdminSlideImage,
} from "../../api/homeApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function AdminSlideEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [slide, setSlide] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadSlide() {
    const slides = await getAdminSlides();
    const foundSlide = slides.find((item) => Number(item.id) === Number(id));

    if (!foundSlide) {
      throw new Error("Slide introuvable.");
    }

    setSlide(foundSlide);
    return foundSlide;
  }

  useEffect(() => {
    async function loadPage() {
      try {
        setLoadingPage(true);
        setError("");
        await loadSlide();
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Impossible de charger le slide."
        );
      } finally {
        setLoadingPage(false);
      }
    }

    loadPage();
  }, [id]);

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateAdminSlide(id, formData);
      navigate("/admin/home");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de modifier le slide."
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

      const updatedSlide = await uploadAdminSlideImage(id, file);
      setSlide(updatedSlide);

      setSuccess("Image du slide modifiée avec succès.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de modifier l'image du slide."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (loadingPage) return <Loader text="Chargement du slide..." />;
  if (error && !slide) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Modifier un slide</h1>
            <p>Édition d’un slide du carrousel d’accueil.</p>
          </div>

          <Link to="/admin/home" className="btn btn-secondary">
            Retour accueil
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}
        {success && <div className="box success-box">{success}</div>}

        <div className="box admin-upload-box">
          <h2>Image du slide</h2>

          {slide?.imageUrl ? (
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="admin-product-preview-image"
            />
          ) : (
            <p>Aucune image pour ce slide.</p>
          )}

          <label className="btn btn-secondary admin-file-label">
            {uploading ? "Envoi en cours..." : "Changer l’image du slide"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              hidden
            />
          </label>
        </div>

        <SlideAdminForm
          initialValues={slide}
          onSubmit={handleSave}
          submitLabel="Enregistrer les modifications"
          loading={saving}
        />
      </section>
    </div>
  );
}

export default AdminSlideEditPage;