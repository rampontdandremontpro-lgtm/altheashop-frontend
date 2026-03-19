import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const imageUrl =
    product.images?.[0]?.imageUrl || "https://placehold.co/600x400?text=Produit";

  return (
    <article className="card">
      <Link to={`/product/${product.slug}`} className="card-image-wrapper">
        <img src={imageUrl} alt={product.name} className="card-image" />
      </Link>

      <div className="card-body">
        <p className="product-category">{product.category?.name || "Catégorie"}</p>
        <h3>{product.name}</h3>
        <p className="product-description">
          {product.shortDescription || product.description || "Aucune description"}
        </p>

        <div className="product-meta">
          <strong>{formatPrice(product.priceCents)}</strong>
          <span className={product.stock > 0 ? "stock-ok" : "stock-ko"}>
            {product.stock > 0 ? `Stock: ${product.stock}` : "Rupture"}
          </span>
        </div>

        <div className="product-actions">
          <Link to={`/product/${product.slug}`} className="btn btn-secondary">
            Voir
          </Link>

          <button
            className="btn btn-primary"
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
          >
            Ajouter
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;