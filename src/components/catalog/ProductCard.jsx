import { Link } from "react-router-dom";
import { useState } from "react";
import { formatPrice } from "../../utils/formatPrice";
import { useI18n } from "../../context/I18nContext";
import { getTranslatedProduct } from "../../utils/productTranslations";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/400x400?text=Image+indisponible";

function ProductCard({ product }) {
  const { t, language } = useI18n();

  const translatedProduct = getTranslatedProduct(product, language);

  const [imageSrc, setImageSrc] = useState(
    translatedProduct.imageUrl ||
      translatedProduct.images?.[0]?.url ||
      FALLBACK_IMAGE
  );

  return (
    <article className="product-card box">
      <Link
        to={`/product/${translatedProduct.slug || translatedProduct.id}`}
      >
        <img
          src={imageSrc}
          alt={translatedProduct.name}
          className="product-card-image"
          onError={() => setImageSrc(FALLBACK_IMAGE)}
        />
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