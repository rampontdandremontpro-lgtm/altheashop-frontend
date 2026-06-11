import { Link } from "react-router-dom";
import { useState } from "react";
import { formatPrice } from "../../utils/formatPrice";
import { useI18n } from "../../context/I18nContext";
import { getTranslatedProduct } from "../../utils/productTranslations";
import { resolveImageUrl } from "../../api/axios";

function ProductCard({ product }) {
  const { t, language } = useI18n();

  const translatedProduct = getTranslatedProduct(product, language);

  const initialImage =
    translatedProduct.imageUrl ||
    translatedProduct.images?.[0]?.url ||
    translatedProduct.images?.[0]?.imageUrl ||
    "";

  const [imageSrc, setImageSrc] = useState(resolveImageUrl(initialImage));
  const [imageError, setImageError] = useState(false);

  return (
    <article className="product-card box">
      <Link to={`/product/${translatedProduct.slug || translatedProduct.id}`}>
        {imageSrc && !imageError ? (
          <img
            src={imageSrc}
            alt={translatedProduct.name}
            className="product-card-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="image-placeholder product-card-image">
            Image indisponible
          </div>
        )}
      </Link>

      <div className="product-card-content">
        <p className="product-card-category">
          {translatedProduct.category?.name}
        </p>

        <h3>{translatedProduct.name}</h3>

        <p className="product-card-price">
          {formatPrice(translatedProduct.priceCents)}
        </p>

        <p className="product-card-description">
          {translatedProduct.shortDescription}
        </p>

        <Link
          to={`/product/${translatedProduct.slug || translatedProduct.id}`}
          className="btn btn-primary"
        >
          {t("viewProduct")}
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;