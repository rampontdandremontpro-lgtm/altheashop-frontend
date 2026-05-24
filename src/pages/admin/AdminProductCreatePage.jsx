import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductAdminForm from "../../components/admin/ProductAdminForm";
import { createAdminProduct } from "../../api/adminApi";

function AdminProductCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      setError("");
      await createAdminProduct(formData);
      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "Impossible de créer le produit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Créer un produit</h1>
            <p>Ajout d’un nouveau produit</p>
          </div>

          <Link to="/admin/products" className="btn btn-secondary">
            Retour
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}

        <ProductAdminForm
          onSubmit={handleCreate}
          submitLabel="Créer le produit"
          loading={loading}
        />
      </section>
    </div>
  );
}

export default AdminProductCreatePage;