import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/catalogApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatPrice } from "../utils/formatPrice";
import { useCart } from "../context/CartContext";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=Image+indisponible";

function getMainImage(product) {
  return (
    product?.imageUrl ||
    product?.images?.[0]?.url ||
    product?.images?.[0]?.imageUrl ||
    FALLBACK_IMAGE
  );
}

function ProductPage() {
  const params = useParams();
  const identifier = params.slug || params.id;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(FALLBACK_IMAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(identifier);
        setProduct(data);
        setMainImage(getMainImage(data));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Impossible de charger le produit."
        );
      } finally {
        setLoading(false);
      }
    }

    if (identifier) loadProduct();
  }, [identifier]);

  if (loading) return <Loader text="Chargement du produit..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Produit introuvable." />;

  return (
    <div className="page-stack">
      <section className="section">
        <div className="product-detail">
          <div className="box">
            <img
              src={mainImage}
              alt={product.name}
              className="product-main-image"
              onError={() => setMainImage(FALLBACK_IMAGE)}
            />
          </div>

          <div className="box">
            <p className="product-category">{product.category?.name}</p>

            <h1>{product.name}</h1>

            <p className="product-price">{formatPrice(product.priceCents)}</p>

            <p className={product.stock > 0 ? "stock-ok" : "stock-ko"}>
              {product.stock > 0
                ? `En stock (${product.stock})`
                : "Rupture de stock"}
            </p>

            <p>{product.shortDescription}</p>

            <button
              className="btn btn-primary"
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
            >
              Ajouter au panier
            </button>

            <hr />

            <h2>Description</h2>
            <p>{product.description}</p>

            <hr />

            <h2>Caractéristiques techniques</h2>
            <p>
              {typeof product.techSpecs === "string"
                ? product.techSpecs
                : product.techSpecs?.content || ""}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;