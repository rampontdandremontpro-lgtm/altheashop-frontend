import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CategoryAdminForm from "../../components/admin/CategoryAdminForm";
import { createAdminCategory } from "../../api/adminApi";

function AdminCategoryCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      setError("");

      await createAdminCategory(formData);
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