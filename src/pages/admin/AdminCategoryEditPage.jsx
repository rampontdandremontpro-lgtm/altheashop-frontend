import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CategoryAdminForm from "../../components/admin/CategoryAdminForm";
import {
  getAdminCategories,
  updateAdminCategory,
} from "../../api/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function AdminCategoryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategory() {
      try {
        setLoadingPage(true);
        setError("");

        const categories = await getAdminCategories();
        const foundCategory = categories.find(
          (item) => Number(item.id) === Number(id)
        );

        if (!foundCategory) {
          throw new Error("Catégorie introuvable.");
        }

        setCategory(foundCategory);
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

    loadCategory();
  }, [id]);

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      setError("");

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