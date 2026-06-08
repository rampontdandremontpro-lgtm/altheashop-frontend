import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAdminProduct, getAdminProducts } from "../../api/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import AdminTable from "../../components/admin/AdminTable";
import { formatPrice } from "../../utils/formatPrice";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Impossible de charger les produits admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) => {
      const text = `${product.name || ""} ${product.sku || ""} ${
        product.slug || ""
      } ${product.categoryName || ""} ${
        product.shortDescription || ""
      }`.toLowerCase();

      return text.includes(query);
    });
  }, [products, search]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Supprimer ce produit ?");
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteAdminProduct(id);
      setSuccess("Produit supprimé avec succès.");
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      await loadProducts();
    } catch (err) {
      setError(err.message || "Impossible de supprimer le produit.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      `Supprimer ${selectedIds.length} produit(s) sélectionné(s) ?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      await Promise.all(selectedIds.map((id) => deleteAdminProduct(id)));

      setSuccess(`${selectedIds.length} produit(s) supprimé(s) avec succès.`);
      setSelectedIds([]);
      await loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de supprimer la sélection."
      );
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Produit" },
    { key: "categoryName", label: "Catégorie" },
    { key: "stock", label: "Stock" },
    {
      key: "priceCents",
      label: "Prix",
      render: (product) => formatPrice(product.priceCents),
    },
    {
      key: "isActive",
      label: "Actif",
      render: (product) => (product.isActive ? "Oui" : "Non"),
    },
  ];

  if (loading) return <Loader text="Chargement des produits admin..." />;
  if (error && products.length === 0) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Les produits</h1>
            <p>{filteredProducts.length} produit(s)</p>
          </div>

          <div className="admin-page-actions">
            <Link to="/admin" className="btn btn-secondary">
              Retour
            </Link>

            <Link to="/admin/products/new" className="btn btn-primary">
              Nouveau produit
            </Link>
          </div>
        </div>

        {error && <div className="box error-box">{error}</div>}
        {success && <div className="box success-box">{success}</div>}

        <div className="box filters">
          <input
            type="text"
            placeholder="Rechercher nom, SKU, slug, catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {selectedIds.length > 0 && (
          <div className="box admin-bulk-actions">
            <strong>{selectedIds.length} produit(s) sélectionné(s)</strong>

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

        {filteredProducts.length === 0 ? (
          <EmptyState
            title="Aucun produit"
            message="Aucun produit ne correspond à votre recherche."
          />
        ) : (
          <AdminTable
            columns={columns}
            data={filteredProducts}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            emptyMessage="Aucun produit disponible."
            actions={(product) => (
              <div className="admin-actions">
                <Link
                  to={`/admin/products/${product.id}/edit`}
                  className="btn btn-secondary"
                >
                  Modifier
                </Link>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleDelete(product.id)}
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

export default AdminProductsPage;