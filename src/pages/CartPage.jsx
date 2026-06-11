import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useI18n } from "../context/I18nContext";
import { formatPrice } from "../utils/formatPrice";
import { getTranslatedProduct } from "../utils/productTranslations";
import CartSummary from "../components/cart/CartSummary";
import EmptyState from "../components/common/EmptyState";

function CartPage() {
  const { t, language } = useI18n();

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
            <h1>{t("cart")}</h1>
            <p>
              {totalItems} {t("cartItemsCount")}
            </p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <EmptyState
            title={t("cartEmptyTitle")}
            message={t("cartEmptyMessage")}
          />
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {cartItems.map((item) => {
                const translatedItem = getTranslatedProduct(item, language);

                return (
                  <div className="cart-item box" key={item.id}>
                    <img
                      src={
                        item.imageUrl ||
                        "https://placehold.co/120x120?text=Produit"
                      }
                      alt={translatedItem.name}
                      className="cart-item-image"
                    />

                    <div className="cart-item-content">
                      <div className="cart-item-top">
                        <div>
                          <h3>{translatedItem.name}</h3>

                          <p className="cart-item-price">
                            {formatPrice(item.priceCents)}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="link-danger"
                          onClick={() => removeFromCart(item.id)}
                        >
                          {t("remove")}
                        </button>
                      </div>

                      <div className="qty-controls">
                        <button
                          type="button"
                          onClick={() => decreaseQty(item.id)}
                          aria-label={t("decreaseQuantity")}
                        >
                          -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() => increaseQty(item.id)}
                          aria-label={t("increaseQuantity")}
                        >
                          +
                        </button>
                      </div>

                      <p className="cart-line-total">
                        {t("subtotal")} :{" "}
                        <strong>
                          {formatPrice(item.priceCents * item.quantity)}
                        </strong>
                      </p>

                      <Link
                        to={`/product/${item.slug}`}
                        className="cart-back-link"
                      >
                        {t("viewProductAgain")}
                      </Link>
                    </div>
                  </div>
                );
              })}
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