import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAdminCategory, getAdminCategories } from "../../api/adminApi";
import AdminTable from "../../components/admin/AdminTable";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
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

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return categories;

    return categories.filter((category) => {
      const text = `${category.name || ""} ${category.slug || ""} ${
        category.description || ""
      }`.toLowerCase();

      return text.includes(query);
    });
  }, [categories, search]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Supprimer cette catégorie ?");
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteAdminCategory(id);
      setSuccess("Catégorie supprimée avec succès.");
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      await loadCategories();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de supprimer la catégorie. Vérifie qu'aucun produit n'est lié à cette catégorie."
      );
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      `Supprimer ${selectedIds.length} catégorie(s) sélectionnée(s) ?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      await Promise.all(selectedIds.map((id) => deleteAdminCategory(id)));

      setSuccess(`${selectedIds.length} catégorie(s) supprimée(s) avec succès.`);
      setSelectedIds([]);
      await loadCategories();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de supprimer la sélection. Vérifie qu'aucun produit n'est lié aux catégories sélectionnées."
      );
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nom" },
    { key: "slug", label: "Slug" },
    { key: "displayOrder", label: "Ordre" },
    {
      key: "isActive",
      label: "Active",
      render: (category) => (category.isActive ? "Oui" : "Non"),
    },
  ];

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Les catégories</h1>
            <p>{filteredCategories.length} catégorie(s)</p>
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

        <div className="box filters">
          <input
            type="text"
            placeholder="Rechercher nom, slug, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {selectedIds.length > 0 && (
          <div className="box admin-bulk-actions">
            <strong>{selectedIds.length} catégorie(s) sélectionnée(s)</strong>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSelectedIds([])}
              disabled={deleting}
            >
              Annuler la sélection
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={handleBulkDelete}
              disabled={deleting}
            >
              {deleting ? "Suppression..." : "Supprimer la sélection"}
            </button>
          </div>
        )}

        {loading ? (
          <div className="box">Chargement des catégories...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="box">Aucune catégorie ne correspond à votre recherche.</div>
        ) : (
          <AdminTable
            columns={columns}
            data={filteredCategories}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            emptyMessage="Aucune catégorie disponible."
            actions={(category) => (
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
            )}
          />
        )}
      </section>
    </div>
  );
}

export default AdminCategoriesPage;