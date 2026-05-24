import { Link } from "react-router-dom";
import { useState } from "react";
import { formatPrice } from "../../utils/formatPrice";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/400x400?text=Image+indisponible";

function ProductCard({ product }) {
  const [imageSrc, setImageSrc] = useState(
    product.imageUrl ||
      product.images?.[0]?.url ||
      FALLBACK_IMAGE
  );

  return (
    <article className="product-card box">
      <Link to={`/product/${product.slug || product.id}`}>
        <img
          src={imageSrc}
          alt={product.name}
          className="product-card-image"
          onError={() => setImageSrc(FALLBACK_IMAGE)}
        />
      </Link>

      <div className="product-card-content">
        <p className="product-card-category">
          {product.category?.name}
        </p>

        <h3>{product.name}</h3>

        <p className="product-card-price">
          {formatPrice(product.priceCents)}
        </p>

        <p className="product-card-description">
          {product.shortDescription}
        </p>

        <Link
          to={`/product/${product.slug || product.id}`}
          className="btn btn-primary"
        >
          Voir le produit
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;