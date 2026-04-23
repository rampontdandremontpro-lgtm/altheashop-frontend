import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductAdminForm from "../../components/admin/ProductAdminForm";
import {
  getAdminProductById,
  updateAdminProduct,
} from "../../api/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function AdminProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoadingPage(true);
        setError("");
        const data = await getAdminProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || "Impossible de charger le produit.");
      } finally {
        setLoadingPage(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      setError("");
      await updateAdminProduct(id, formData);
      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "Impossible de modifier le produit.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingPage) return <Loader text="Chargement du produit..." />;
  if (error && !product) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Modifier un produit</h1>
            <p>Édition d’un produit côté interface admin.</p>
          </div>
        </div>

        {error && <div className="box error-box">{error}</div>}

        <ProductAdminForm
          initialValues={product}
          onSubmit={handleSave}
          submitLabel="Enregistrer les modifications"
          loading={saving}
        />
      </section>
    </div>
  );
}

export default AdminProductEditPage;