import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SlideAdminForm from "../../components/admin/SlideAdminForm";
import { createAdminSlide } from "../../api/homeApi";

function AdminSlideCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      setError("");

      await createAdminSlide(formData);
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