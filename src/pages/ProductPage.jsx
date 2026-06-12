import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/catalogApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatPrice } from "../utils/formatPrice";
import { useCart } from "../context/CartContext";
import SimilarProducts from "../components/catalog/SimilarProducts";
import { useI18n } from "../context/I18nContext";
import { getTranslatedProduct } from "../utils/productTranslations";
import { getTranslatedCategory } from "../utils/categoryTranslations";
import { resolveImageUrl } from "../api/axios";

function isValidImageUrl(url) {
  return typeof url === "string" && url.trim().length > 0;
}

function getProductImages(product) {
  const images = [];

  if (isValidImageUrl(product?.imageUrl)) {
    images.push(resolveImageUrl(product.imageUrl.trim()));
  }

  if (Array.isArray(product?.images)) {
    const sortedImages = [...product.images].sort(
      (a, b) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0)
    );

    sortedImages.forEach((image) => {
      const url = image?.url || image?.imageUrl;

      if (isValidImageUrl(url)) {
        const resolvedUrl = resolveImageUrl(url.trim());

        if (!images.includes(resolvedUrl)) {
          images.push(resolvedUrl);
        }
      }
    });
  }

  return images;
}

function ProductPage() {
  const { t, language } = useI18n();
  const params = useParams();
  const identifier = params.slug || params.id;
  const { addToCart, cartError } = useCart();

  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [thumbErrors, setThumbErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartSuccess, setCartSuccess] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        setCartSuccess("");
        setImageError(false);
        setThumbErrors({});

        const data = await getProductById(identifier);
        const images = getProductImages(data);

        setProduct(data);
        setProductImages(images);
        setCurrentImageIndex(0);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            t("loadProductError")
        );
      } finally {
        setLoading(false);
      }
    }

    if (identifier) {
      loadProduct();
    }
  }, [identifier, t]);

  const handlePreviousImage = () => {
    setImageError(false);
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setImageError(false);
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = async () => {
    const success = await addToCart(product);

    if (!success) return;

    const translatedProduct = getTranslatedProduct(product, language);
    setCartSuccess(translatedProduct.name);

    window.setTimeout(() => {
      setCartSuccess("");
    }, 3500);
  };

  if (loading) return <Loader text={t("loadingProduct")} />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message={t("productNotFound")} />;

  const currentImage = productImages[currentImageIndex];

const translatedProduct = getTranslatedProduct(
  product,
  language
);

const translatedCategory = getTranslatedCategory(
  product.category,
  language
);

  return (
    <div className="page-stack">
      <section className="section">
        <div className="product-detail">
          <div className="box product-gallery">
            <div className="product-gallery-main">
              {currentImage && !imageError ? (
                <img
                  src={currentImage}
                  alt={translatedProduct.name}
                  className="product-main-image"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="image-placeholder product-main-image">
                  Image indisponible
                </div>
              )}

              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    className="product-gallery-arrow product-gallery-arrow-left"
                    onClick={handlePreviousImage}
                    aria-label={t("previousImage")}
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    className="product-gallery-arrow product-gallery-arrow-right"
                    onClick={handleNextImage}
                    aria-label={t("nextImage")}
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
                    onClick={() => {
                      setImageError(false);
                      setCurrentImageIndex(index);
                    }}
                    aria-label={`${t("showImage")} ${index + 1}`}
                  >
                    {!thumbErrors[index] ? (
                      <img
                        src={image}
                        alt={`${translatedProduct.name} ${index + 1}`}
                        className="thumb-image"
                        onError={() =>
                          setThumbErrors((prev) => ({
                            ...prev,
                            [index]: true,
                          }))
                        }
                      />
                    ) : (
                      <div className="image-placeholder thumb-image">
                        Image indisponible
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="box">
            <p className="product-category">
  {translatedCategory?.name || product.category?.name}
</p>

            <h1>{translatedProduct.name}</h1>

            <p className="product-price">{formatPrice(product.priceCents)}</p>

            <p className={product.stock > 0 ? "stock-ok" : "stock-ko"}>
              {product.stock > 0
                ? `${t("inStock")} (${product.stock})`
                : t("outOfStock")}
            </p>

            <p>{translatedProduct.shortDescription}</p>

            {cartSuccess && (
              <div className="cart-success-message">
                <strong>{t("productAddedTitle")}</strong>
                <p>
                  {cartSuccess} {t("productAddedSuffix")}
                </p>
              </div>
            )}

            {cartError && <div className="box error-box">{cartError}</div>}

            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {t("addToCart")}
            </button>

            <hr />

            <h2>{t("description")}</h2>
            <p>
              {translatedProduct.description || t("noDescriptionAvailable")}
            </p>

            <hr />

            <h2>{t("technicalSpecs")}</h2>
            <p>
              {typeof translatedProduct.techSpecs === "string"
                ? translatedProduct.techSpecs ||
                  t("noTechnicalSpecsAvailable")
                : translatedProduct.techSpecs?.content ||
                  t("noTechnicalSpecsAvailable")}
            </p>
          </div>
        </div>
      </section>

      <SimilarProducts product={product} />
    </div>
  );
}

export default ProductPage;