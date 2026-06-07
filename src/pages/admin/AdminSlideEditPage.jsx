import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SlideAdminForm from "../../components/admin/SlideAdminForm";
import { getAdminSlides, updateAdminSlide } from "../../api/homeApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function AdminSlideEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [slide, setSlide] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSlide() {
      try {
        setLoadingPage(true);
        setError("");

        const slides = await getAdminSlides();
        const foundSlide = slides.find((item) => Number(item.id) === Number(id));

        if (!foundSlide) {
          throw new Error("Slide introuvable.");
        }

        setSlide(foundSlide);
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

    loadSlide();
  }, [id]);

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      setError("");

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