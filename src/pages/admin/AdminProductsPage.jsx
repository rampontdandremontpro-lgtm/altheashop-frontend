import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteAdminProduct,
  getAdminProducts,
} from "../../api/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import { formatPrice } from "../../utils/formatPrice";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Supprimer ce produit ?");
    if (!confirmed) return;

    try {
      await deleteAdminProduct(id);
      await loadProducts();
    } catch (err) {
      setError(err.message || "Impossible de supprimer le produit.");
    }
  };

  if (loading) return <Loader text="Chargement des produits admin..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Admin Produits</h1>
            <p>{products.length} produit(s)</p>
          </div>

          <Link to="/admin/products/new" className="btn btn-primary">
            Nouveau produit
          </Link>
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="Aucun produit"
            message="Crée un premier produit pour démarrer."
          />
        ) : (
          <div className="box table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produit</th>
                  <th>Catégorie</th>
                  <th>Stock</th>
                  <th>Prix</th>
                  <th>Actif</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.categoryName}</td>
                    <td>{product.stock}</td>
                    <td>{formatPrice(product.priceCents)}</td>
                    <td>{product.isActive ? "Oui" : "Non"}</td>
                    <td>
                      <div className="admin-actions">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="btn btn-secondary"
                        >
                          Modifier
                        </Link>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleDelete(product.id)}
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

export default AdminProductsPage;