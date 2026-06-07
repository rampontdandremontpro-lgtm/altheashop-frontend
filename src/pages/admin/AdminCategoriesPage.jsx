import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteAdminCategory,
  getAdminCategories,
} from "../../api/adminApi";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de charger les catégories."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Supprimer cette catégorie ?");
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteAdminCategory(id);
      setSuccess("Catégorie supprimée avec succès.");
      await loadCategories();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de supprimer la catégorie. Vérifie qu'aucun produit n'est lié à cette catégorie."
      );
    }
  };

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Les catégories</h1>
            <p>{categories.length} catégorie(s)</p>
          </div>

          <div className="admin-dashboard-actions">
            <Link to="/admin" className="btn btn-secondary">
              Retour
            </Link>

            <Link to="/admin/categories/new" className="btn btn-primary">
              Nouvelle catégorie
            </Link>
          </div>
        </div>

        {error && <div className="box error-box">{error}</div>}
        {success && <div className="box success-box">{success}</div>}

        {loading ? (
          <div className="box">Chargement des catégories...</div>
        ) : categories.length === 0 ? (
          <div className="box">Aucune catégorie disponible.</div>
        ) : (
          <div className="box table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Slug</th>
                  <th>Ordre</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.slug}</td>
                    <td>{category.displayOrder}</td>
                    <td>{category.isActive ? "Oui" : "Non"}</td>
                    <td>
                      <div className="admin-actions">
                        <Link
                          to={`/admin/categories/${category.id}/edit`}
                          className="btn btn-secondary"
                        >
                          Modifier
                        </Link>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleDelete(category.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminCategoriesPage;