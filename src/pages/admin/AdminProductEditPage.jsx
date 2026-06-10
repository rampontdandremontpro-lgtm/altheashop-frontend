import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductAdminForm from "../../components/admin/ProductAdminForm";
import {
  deleteAdminProductGalleryImage,
  getAdminProductById,
  getAdminProductImages,
  updateAdminProduct,
  uploadAdminProductGalleryImage,
  uploadAdminProductImage,
} from "../../api/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function AdminProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProduct() {
    const data = await getAdminProductById(id);
    setProduct(data);
  }

  async function loadGalleryImages() {
    const images = await getAdminProductImages(id);
    setGalleryImages(images);
  }

  async function loadPageData() {
    try {
      setLoadingPage(true);
      setError("");

      await Promise.all([loadProduct(), loadGalleryImages()]);
    } catch (err) {
      setError(err.message || "Impossible de charger le produit.");
    } finally {
      setLoadingPage(false);
    }
  }

  useEffect(() => {
    loadPageData();
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
      setSuccess("Image principale envoyée avec succès.");

      await Promise.all([loadProduct(), loadGalleryImages()]);
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

  const handleGalleryUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Merci de choisir un fichier image.");
      return;
    }

    try {
      setUploadingGallery(true);
      setError("");
      setSuccess("");

      await uploadAdminProductGalleryImage(id, file);
      setSuccess("Image ajoutée à la galerie avec succès.");

      await Promise.all([loadProduct(), loadGalleryImages()]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible d'ajouter l'image à la galerie."
      );
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette image de la galerie ?"
    );

    if (!confirmed) return;

    try {
      setDeletingImageId(imageId);
      setError("");
      setSuccess("");

      await deleteAdminProductGalleryImage(id, imageId);
      setSuccess("Image supprimée de la galerie.");

      await Promise.all([loadProduct(), loadGalleryImages()]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de supprimer l'image."
      );
    } finally {
      setDeletingImageId(null);
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
          <h2>Image principale du produit</h2>

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
            {uploading ? "Envoi en cours..." : "Changer l’image principale"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              hidden
            />
          </label>
        </div>

        <div className="box admin-upload-box">
          <h2>Galerie du produit</h2>

          <p className="form-help-text">
            Les images ajoutées ici apparaissent dans la galerie sur la fiche
            produit côté client.
          </p>

          <label className="btn btn-secondary admin-file-label">
            {uploadingGallery ? "Ajout en cours..." : "Ajouter une image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleGalleryUpload}
              disabled={uploadingGallery}
              hidden
            />
          </label>

          {galleryImages.length === 0 ? (
            <p>Aucune image dans la galerie.</p>
          ) : (
            <div className="admin-product-gallery">
              {galleryImages.map((image) => (
                <div key={image.id} className="admin-product-gallery-item">
                  <img
                    src={image.url || image.imageUrl}
                    alt={image.altText || product.name}
                    className="admin-product-gallery-image"
                  />

                  <div className="admin-product-gallery-info">
                    <strong>{image.altText || product.name}</strong>
                    <span>Ordre : {image.displayOrder ?? 0}</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDeleteGalleryImage(image.id)}
                    disabled={deletingImageId === image.id}
                  >
                    {deletingImageId === image.id
                      ? "Suppression..."
                      : "Supprimer"}
                  </button>
                </div>
              ))}
            </div>
          )}
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