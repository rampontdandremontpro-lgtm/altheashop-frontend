import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteAdminSlide,
  getAdminHome,
  getAdminSlides,
  updateAdminHome,
} from "../../api/homeApi";
import AdminTable from "../../components/admin/AdminTable";

function AdminHomePage() {
  const [homeText, setHomeText] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingText, setSavingText] = useState(false);
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
      setSlides(Array.isArray(slidesData) ? slidesData : []);
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

  const columns = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "title",
      label: "Titre",
    },
    {
      key: "subtitle",
      label: "Sous-titre",
      render: (slide) => slide.subtitle || "-",
    },
    {
      key: "displayOrder",
      label: "Ordre",
    },
    {
      key: "isActive",
      label: "Actif",
      render: (slide) => (slide.isActive ? "Oui" : "Non"),
    },
  ];

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

          <div className="admin-dashboard-actions">
            <Link to="/admin" className="btn btn-secondary">
              Retour
            </Link>

            <Link to="/admin/home/slides/new" className="btn btn-primary">
              Nouveau slide
            </Link>
          </div>
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

            <button
              className="btn btn-primary"
              type="submit"
              disabled={savingText}
            >
              {savingText ? "Enregistrement..." : "Enregistrer le texte"}
            </button>
          </form>
        </div>

        <div className="box">
          <h2>Slides du carrousel</h2>

          {slides.length === 0 ? (
            <p>Aucun slide disponible.</p>
          ) : (
            <AdminTable
              columns={columns}
              data={slides}
              emptyMessage="Aucun slide disponible."
              actions={(slide) => (
                <div className="admin-actions">
                  <Link
                    to={`/admin/home/slides/${slide.id}/edit`}
                    className="btn btn-secondary"
                  >
                    Modifier
                  </Link>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleDeleteSlide(slide.id)}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminHomePage;