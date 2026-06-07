import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductAdminForm from "../../components/admin/ProductAdminForm";
import {
  getAdminProductById,
  updateAdminProduct,
  uploadAdminProductImage,
} from "../../api/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function AdminProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateAdminProduct(id, formData);
      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "Impossible de modifier le produit.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Merci de choisir un fichier image.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      await uploadAdminProductImage(id, file);
      setSuccess("Image envoyée avec succès.");

      await loadProduct();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible d'envoyer l'image."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
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

          <Link to="/admin/products" className="btn btn-secondary">
            Retour produits
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}
        {success && <div className="box success-box">{success}</div>}

        <div className="box admin-upload-box">
          <h2>Image du produit</h2>

          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="admin-product-preview-image"
            />
          ) : (
            <p>Aucune image principale.</p>
          )}

          <label className="btn btn-secondary admin-file-label">
            {uploading ? "Envoi en cours..." : "Choisir une image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              hidden
            />
          </label>

          <p className="form-help-text">
            Vous pouvez aussi garder l’URL image dans le formulaire ci-dessous.
          </p>
        </div>

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