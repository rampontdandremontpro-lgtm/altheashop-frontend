import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createAdminSlide,
  deleteAdminSlide,
  getAdminHome,
  getAdminSlides,
  updateAdminHome,
  updateAdminSlide,
} from "../../api/homeApi";

const EMPTY_SLIDE = {
  title: "",
  subtitle: "",
  imageUrl: "",
  ctaLabel: "",
  ctaUrl: "",
  displayOrder: 0,
  isActive: true,
};

function AdminHomePage() {
  const [homeText, setHomeText] = useState("");
  const [slides, setSlides] = useState([]);
  const [slideForm, setSlideForm] = useState(EMPTY_SLIDE);
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingText, setSavingText] = useState(false);
  const [savingSlide, setSavingSlide] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadAdminHome() {
    try {
      setLoading(true);
      setError("");

      const [homeData, slidesData] = await Promise.all([
        getAdminHome(),
        getAdminSlides(),
      ]);

      setHomeText(homeData.homeText || "");
      setSlides(slidesData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de charger la gestion de l'accueil."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminHome();
  }, []);

  const handleSaveHomeText = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSavingText(true);

      await updateAdminHome({ homeText });
      setSuccess("Texte d'accueil mis à jour.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de modifier le texte d'accueil."
      );
    } finally {
      setSavingText(false);
    }
  };

  const handleSlideChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSlideForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSlide = (slide) => {
    setEditingSlideId(slide.id);
    setSlideForm({
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      imageUrl: slide.imageUrl || "",
      ctaLabel: slide.ctaLabel || "",
      ctaUrl: slide.ctaUrl || "",
      displayOrder: slide.displayOrder ?? 0,
      isActive: slide.isActive ?? true,
    });
    setError("");
    setSuccess("");
  };

  const handleCancelEdit = () => {
    setEditingSlideId(null);
    setSlideForm(EMPTY_SLIDE);
    setError("");
    setSuccess("");
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!slideForm.title || !slideForm.imageUrl) {
      setError("Le titre et l'image du slide sont obligatoires.");
      return;
    }

    try {
      setSavingSlide(true);

      if (editingSlideId) {
        await updateAdminSlide(editingSlideId, slideForm);
        setSuccess("Slide modifié avec succès.");
      } else {
        await createAdminSlide(slideForm);
        setSuccess("Slide créé avec succès.");
      }

      setEditingSlideId(null);
      setSlideForm(EMPTY_SLIDE);
      await loadAdminHome();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible d'enregistrer le slide."
      );
    } finally {
      setSavingSlide(false);
    }
  };

  const handleDeleteSlide = async (id) => {
    const confirmed = window.confirm("Supprimer ce slide ?");
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteAdminSlide(id);
      setSuccess("Slide supprimé avec succès.");
      await loadAdminHome();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de supprimer le slide."
      );
    }
  };

  if (loading) {
    return (
      <div className="page-stack">
        <section className="section">
          <div className="box">Chargement de l'accueil admin...</div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Gestion de l'accueil</h1>
            <p>Modifiez le texte d'accueil et le carrousel.</p>
          </div>

          <Link to="/admin" className="btn btn-secondary">
            Retour dashboard
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}
        {success && <div className="box success-box">{success}</div>}

        <div className="box">
          <h2>Texte d'accueil</h2>

          <form className="admin-product-form" onSubmit={handleSaveHomeText}>
            <textarea
              name="homeText"
              placeholder="Texte affiché sur la page d'accueil"
              value={homeText}
              onChange={(e) => setHomeText(e.target.value)}
              rows="5"
              className="contact-textarea"
            />

            <button className="btn btn-primary" type="submit" disabled={savingText}>
              {savingText ? "Enregistrement..." : "Enregistrer le texte"}
            </button>
          </form>
        </div>

        <div className="box">
          <h2>{editingSlideId ? "Modifier un slide" : "Créer un slide"}</h2>

          <form className="admin-product-form" onSubmit={handleSaveSlide}>
            <input
              type="text"
              name="title"
              placeholder="Titre"
              value={slideForm.title}
              onChange={handleSlideChange}
            />

            <input
              type="text"
              name="subtitle"
              placeholder="Sous-titre"
              value={slideForm.subtitle}
              onChange={handleSlideChange}
            />

            <input
              type="text"
              name="imageUrl"
              placeholder="URL de l'image"
              value={slideForm.imageUrl}
              onChange={handleSlideChange}
            />

            <input
              type="number"
              name="displayOrder"
              placeholder="Ordre d'affichage"
              value={slideForm.displayOrder}
              onChange={handleSlideChange}
              min="0"
            />

            <input
              type="text"
              name="ctaLabel"
              placeholder="Texte du bouton"
              value={slideForm.ctaLabel}
              onChange={handleSlideChange}
            />

            <input
              type="text"
              name="ctaUrl"
              placeholder="Lien du bouton (/catalog par exemple)"
              value={slideForm.ctaUrl}
              onChange={handleSlideChange}
            />

            <label className="settings-item">
              <input
                type="checkbox"
                name="isActive"
                checked={slideForm.isActive}
                onChange={handleSlideChange}
              />
              Slide actif
            </label>

            <div className="admin-page-actions">
              <button className="btn btn-primary" type="submit" disabled={savingSlide}>
                {savingSlide
                  ? "Enregistrement..."
                  : editingSlideId
                  ? "Modifier le slide"
                  : "Créer le slide"}
              </button>

              {editingSlideId && (
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="box table-wrapper">
          <h2>Slides du carrousel</h2>

          {slides.length === 0 ? (
            <p>Aucun slide disponible.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titre</th>
                  <th>Ordre</th>
                  <th>Actif</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {slides.map((slide) => (
                  <tr key={slide.id}>
                    <td>{slide.id}</td>
                    <td>{slide.title}</td>
                    <td>{slide.displayOrder}</td>
                    <td>{slide.isActive ? "Oui" : "Non"}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleEditSlide(slide)}
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleDeleteSlide(slide.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminHomePage;