import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import CartSummary from "../components/cart/CartSummary";
import EmptyState from "../components/common/EmptyState";

function CartPage() {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalItems,
    totalPriceCents,
  } = useCart();

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Panier</h1>
            <p>{totalItems} article(s)</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <EmptyState
            title="Votre panier est vide"
            message="Ajoutez des produits depuis le catalogue pour commencer."
          />
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {cartItems.map((item) => (
                <div className="cart-item box" key={item.id}>
                  <img
                    src={item.imageUrl || "https://placehold.co/120x120?text=Produit"}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  <div className="cart-item-content">
                    <div className="cart-item-top">
                      <div>
                        <h3>{item.name}</h3>
                        <p className="cart-item-price">
                          {formatPrice(item.priceCents)}
                        </p>
                      </div>

                      <button
                        className="link-danger"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Supprimer
                      </button>
                    </div>

                    <div className="qty-controls">
                      <button onClick={() => decreaseQty(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)}>+</button>
                    </div>

                    <p className="cart-line-total">
                      Sous-total :{" "}
                      <strong>{formatPrice(item.priceCents * item.quantity)}</strong>
                    </p>

                    <Link to={`/product/${item.slug}`} className="cart-back-link">
                      Revoir le produit
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <CartSummary
              totalItems={totalItems}
              totalPriceCents={totalPriceCents}
              onClearCart={clearCart}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default CartPage;