import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/catalogApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatPrice } from "../utils/formatPrice";
import { useCart } from "../context/CartContext";
import SimilarProducts from "../components/catalog/SimilarProducts";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=Image+indisponible";

function isValidImageUrl(url) {
  return typeof url === "string" && url.trim().length > 0;
}

function getProductImages(product) {
  const images = [];

  if (isValidImageUrl(product?.imageUrl)) {
    images.push(product.imageUrl.trim());
  }

  if (Array.isArray(product?.images)) {
    product.images.forEach((image) => {
      const url = image?.url || image?.imageUrl;

      if (isValidImageUrl(url) && !images.includes(url.trim())) {
        images.push(url.trim());
      }
    });
  }

  return images.length > 0 ? images : [FALLBACK_IMAGE];
}

function ProductPage() {
  const params = useParams();
  const identifier = params.slug || params.id;
  const { addToCart, cartError } = useCart();

  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([FALLBACK_IMAGE]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartSuccess, setCartSuccess] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        setCartSuccess("");

        const data = await getProductById(identifier);
        const images = getProductImages(data);

        setProduct(data);
        setProductImages(images);
        setCurrentImageIndex(0);
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

    if (identifier) {
      loadProduct();
    }
  }, [identifier]);

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = async () => {
    const success = await addToCart(product);

    if (!success) return;

    setCartSuccess(`${product.name} a bien été ajouté à votre panier.`);

    window.setTimeout(() => {
      setCartSuccess("");
    }, 3500);
  };

  if (loading) return <Loader text="Chargement du produit..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Produit introuvable." />;

  const currentImage = productImages[currentImageIndex];

  return (
    <div className="page-stack">
      <section className="section">
        <div className="product-detail">
          <div className="box product-gallery">
            <div className="product-gallery-main">
              <img
                src={currentImage}
                alt={product.name}
                className="product-main-image"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />

              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    className="product-gallery-arrow product-gallery-arrow-left"
                    onClick={handlePreviousImage}
                    aria-label="Image précédente"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    className="product-gallery-arrow product-gallery-arrow-right"
                    onClick={handleNextImage}
                    aria-label="Image suivante"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="product-thumbnails">
                {productImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={
                      index === currentImageIndex
                        ? "thumb-button active"
                        : "thumb-button"
                    }
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Afficher l'image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
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
            <p className="product-category">{product.category?.name}</p>

            <h1>{product.name}</h1>

            <p className="product-price">{formatPrice(product.priceCents)}</p>

            <p className={product.stock > 0 ? "stock-ok" : "stock-ko"}>
              {product.stock > 0
                ? `En stock (${product.stock})`
                : "Rupture de stock"}
            </p>

            <p>{product.shortDescription}</p>

            {cartSuccess && (
              <div className="cart-success-message">
                <strong>Article ajouté</strong>
                <p>{cartSuccess}</p>
              </div>
            )}

            {cartError && <div className="box error-box">{cartError}</div>}

            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
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

      <SimilarProducts product={product} />
    </div>
  );
}

export default ProductPage;