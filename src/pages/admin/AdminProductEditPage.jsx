import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductAdminForm from "../../components/admin/ProductAdminForm";
import {
  deleteAdminProductGalleryImage,
  getAdminProductById,
  updateAdminProduct,
  updateAdminProductGalleryImage,
  uploadAdminProductGalleryImage,
  uploadAdminProductImage,
} from "../../api/adminApi";
import { resolveImageUrl } from "../../api/axios";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function sortImages(images) {
  return [...images].sort(
    (a, b) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0)
  );
}

function AdminProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryForms, setGalleryForms] = useState({});
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
    return data;
  }

  function loadGalleryImages(productData) {
    const images = Array.isArray(productData?.images) ? productData.images : [];
    const mainImageUrl = productData?.imageUrl || "";

    const filteredImages = images.filter((image) => {
      const imageUrl = image.url || image.imageUrl || "";

      return imageUrl !== mainImageUrl;
    });

    const sortedImages = sortImages(filteredImages);

    setGalleryImages(sortedImages);

    const forms = {};

    sortedImages.forEach((image, index) => {
      forms[image.id] = {
        altText: image.altText || "",
        displayOrder: Number(image.displayOrder ?? index + 1),
      };
    });

    setGalleryForms(forms);
  }

  async function refreshProductAndGallery() {
    const productData = await loadProduct();
    loadGalleryImages(productData);
    return productData;
  }

  async function loadPageData() {
    try {
      setLoadingPage(true);
      setError("");
      setSuccess("");

      await refreshProductAndGallery();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de charger le produit."
      );
    } finally {
      setLoadingPage(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, [id]);

  const handleGalleryFormChange = (imageId, field, value) => {
    setGalleryForms((prev) => ({
      ...prev,
      [imageId]: {
        ...prev[imageId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await Promise.all(
        galleryImages.map((image) =>
          updateAdminProductGalleryImage(id, image.id, {
            altText: galleryForms[image.id]?.altText || "",
            displayOrder: Number(galleryForms[image.id]?.displayOrder || 1),
          })
        )
      );

      await updateAdminProduct(id, {
        ...formData,
      });

      navigate("/admin/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible d'enregistrer les modifications."
      );
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
      await refreshProductAndGallery();

      setSuccess("Image principale modifiée avec succès.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de modifier l'image principale."
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
      await refreshProductAndGallery();

      setSuccess("Image secondaire ajoutée à la galerie.");
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
      "Voulez-vous vraiment supprimer cette image secondaire ?"
    );

    if (!confirmed) return;

    try {
      setDeletingImageId(imageId);
      setError("");
      setSuccess("");

      await deleteAdminProductGalleryImage(id, imageId);
      await refreshProductAndGallery();

      setSuccess("Image secondaire supprimée.");
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

  if (loadingPage) {
    return <Loader text="Chargement du produit..." />;
  }

  if (error && !product) {
    return <ErrorMessage message={error} />;
  }

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

          <p className="form-help-text">
            Cette image est utilisée dans le catalogue, la recherche, le panier
            et comme première image de la fiche produit.
          </p>

          {product?.imageUrl ? (
            <img
              src={resolveImageUrl(product.imageUrl)}
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
            La galerie contient uniquement les images secondaires affichées après
            l’image principale sur la fiche produit. L’ordre commence à 1.
          </p>

          <label className="btn btn-secondary admin-file-label">
            {uploadingGallery
              ? "Ajout en cours..."
              : "Ajouter une image secondaire"}
            <input
              type="file"
              accept="image/*"
              onChange={handleGalleryUpload}
              disabled={uploadingGallery}
              hidden
            />
          </label>

          {galleryImages.length === 0 ? (
            <p>Aucune image secondaire dans la galerie.</p>
          ) : (
            <div className="admin-product-gallery">
              {galleryImages.map((image) => (
                <div key={image.id} className="admin-product-gallery-item">
                  <img
                    src={resolveImageUrl(image.url || image.imageUrl)}
                    alt={galleryForms[image.id]?.altText || product.name}
                    className="admin-product-gallery-image"
                  />

                  <label className="admin-gallery-field">
                    Texte alternatif
                    <input
                      type="text"
                      value={galleryForms[image.id]?.altText || ""}
                      onChange={(e) =>
                        handleGalleryFormChange(
                          image.id,
                          "altText",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-gallery-field">
                    Position dans la galerie
                    <input
                      type="number"
                      min="1"
                      value={galleryForms[image.id]?.displayOrder ?? 1}
                      onChange={(e) =>
                        handleGalleryFormChange(
                          image.id,
                          "displayOrder",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <div className="admin-gallery-actions">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDeleteGalleryImage(image.id)}
                      disabled={deletingImageId === image.id}
                    >
                      {deletingImageId === image.id
                        ? "Suppression..."
                        : "Supprimer l’image secondaire"}
                    </button>
                  </div>
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