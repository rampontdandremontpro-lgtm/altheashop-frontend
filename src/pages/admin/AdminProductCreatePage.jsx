import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductAdminForm from "../../components/admin/ProductAdminForm";
import {
  createAdminProduct,
  updateAdminProductGalleryImage,
  uploadAdminProductGalleryImage,
  uploadAdminProductImage,
} from "../../api/adminApi";

function AdminProductCreatePage() {
  const navigate = useNavigate();

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Merci de choisir un fichier image.");
      return;
    }

    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleGalleryImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Merci de choisir un fichier image.");
      return;
    }

    setGalleryFiles((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        altText: "",
        displayOrder: prev.length + 1,
      },
    ]);

    e.target.value = "";
  };

  const handleGalleryFieldChange = (imageId, field, value) => {
    setGalleryFiles((prev) =>
      prev.map((image) =>
        image.id === imageId ? { ...image, [field]: value } : image
      )
    );
  };

  const handleRemoveGalleryImage = (imageId) => {
    setGalleryFiles((prev) => prev.filter((image) => image.id !== imageId));
  };

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      setError("");

      const createdProduct = await createAdminProduct(formData);

      if (mainImageFile) {
        await uploadAdminProductImage(createdProduct.id, mainImageFile);
      }

      for (const galleryImage of galleryFiles) {
        const uploadedImage = await uploadAdminProductGalleryImage(
          createdProduct.id,
          galleryImage.file
        );

        await updateAdminProductGalleryImage(
          createdProduct.id,
          uploadedImage.id,
          {
            altText: galleryImage.altText || formData.name || "",
            displayOrder: Number(galleryImage.displayOrder || 1),
          }
        );
      }

      navigate("/admin/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de créer le produit."
      );
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
            <p>Ajout d’un nouveau produit côté interface admin.</p>
          </div>

          <Link to="/admin/products" className="btn btn-secondary">
            Retour produits
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}

        <div className="box admin-upload-box">
          <h2>Image principale du produit</h2>

          <p className="form-help-text">
            Cette image sera utilisée dans le catalogue, la recherche, le panier
            et comme première image de la fiche produit.
          </p>

          {mainImagePreview ? (
            <img
              src={mainImagePreview}
              alt="Aperçu image principale"
              className="admin-product-preview-image"
            />
          ) : (
            <p>Aucune image principale choisie.</p>
          )}

          <label className="btn btn-secondary admin-file-label">
            Choisir une image principale
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              disabled={loading}
              hidden
            />
          </label>
        </div>

        <div className="box admin-upload-box">
          <h2>Galerie du produit</h2>

          <p className="form-help-text">
            Ajoute ici les images secondaires. La position commence à 1.
          </p>

          <label className="btn btn-secondary admin-file-label">
            Ajouter une image secondaire
            <input
              type="file"
              accept="image/*"
              onChange={handleGalleryImageChange}
              disabled={loading}
              hidden
            />
          </label>

          {galleryFiles.length === 0 ? (
            <p>Aucune image secondaire choisie.</p>
          ) : (
            <div className="admin-product-gallery">
              {galleryFiles.map((image) => (
                <div key={image.id} className="admin-product-gallery-item">
                  <img
                    src={image.preview}
                    alt={image.altText || "Image secondaire"}
                    className="admin-product-gallery-image"
                  />

                  <label className="admin-gallery-field">
                    Texte alternatif
                    <input
                      type="text"
                      value={image.altText}
                      onChange={(e) =>
                        handleGalleryFieldChange(
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
                      value={image.displayOrder}
                      onChange={(e) =>
                        handleGalleryFieldChange(
                          image.id,
                          "displayOrder",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleRemoveGalleryImage(image.id)}
                    disabled={loading}
                  >
                    Retirer l’image secondaire
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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