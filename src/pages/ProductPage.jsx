import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "../api/catalogApi";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

const FALLBACK_IMAGE =
  "https://placehold.co/800x500/e5e7eb/6b7280?text=Image+indisponible";

function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(FALLBACK_IMAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProductBySlug(slug);
        setProduct(data);
        setMainImage(data.images?.[0]?.imageUrl || FALLBACK_IMAGE);
      } catch (err) {
        setError("Produit introuvable.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) return <Loader text="Chargement du produit..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  const images = product.images || [];

  return (
    <div className="page-stack">
      <section className="product-detail">
        <div className="box">
          <img
            src={mainImage}
            alt={product.name}
            className="product-main-image"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />

          {images.length > 0 && (
            <div className="thumbs">
              {images.map((img) => (
                <button
                  key={img.id}
                  className="thumb-button"
                  onClick={() => setMainImage(img.imageUrl || FALLBACK_IMAGE)}
                >
                  <img
                    src={img.imageUrl || FALLBACK_IMAGE}
                    alt={img.altText || product.name}
                    className="thumb-image"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="box">
          <p className="product-category">{product.category?.name || "Catégorie"}</p>
          <h1>{product.name}</h1>
          <p className="product-price">{formatPrice(product.priceCents)}</p>

          <p className={product.stock > 0 ? "stock-ok" : "stock-ko"}>
            {product.stock > 0 ? `En stock (${product.stock})` : "Rupture de stock"}
          </p>

          <p>{product.shortDescription || product.description}</p>

          <button
            className="btn btn-primary"
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
          >
            Ajouter au panier
          </button>

          {product.description && (
            <div className="detail-box">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {product.techSpecs && (
            <div className="detail-box">
              <h3>Caractéristiques techniques</h3>
              <p>{product.techSpecs}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductPage;