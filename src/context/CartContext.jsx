import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  addCartItem,
  clearCartApi,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "../api/cartApi";
import { resolveImageUrl } from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const LOCAL_STORAGE_KEY = "althea_cart";

function hasToken() {
  return Boolean(
    localStorage.getItem("althea_token") ||
      sessionStorage.getItem("althea_token")
  );
}

function normalizeImage(product) {
  return resolveImageUrl(
    product?.imageUrl ||
      product?.images?.[0]?.url ||
      product?.images?.[0]?.imageUrl ||
      ""
  );
}

function normalizeCartResponse(data) {
  const items = Array.isArray(data?.items) ? data.items : [];

  return items.map((item) => ({
    cartItemId: item.id,
    id: item.product?.id || item.productId,
    productId: item.productId,
    slug: item.product?.slug || "",
    name: item.product?.name || "Produit",
    priceCents: item.product?.priceCents || 0,
    stock: item.product?.stock || 0,
    imageUrl: normalizeImage(item.product),
    translations: Array.isArray(item.product?.translations)
      ? item.product.translations
      : [],
    quantity: item.quantity,
  }));
}

function getLocalCart() {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveLocalCart(items) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const { user, isAuthenticated, authLoading } = useAuth();

  const [cartItems, setCartItems] = useState(() =>
    hasToken() ? [] : getLocalCart()
  );
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState("");

  const loadCart = async () => {
    if (!hasToken()) {
      setCartItems(getLocalCart());
      return;
    }

    try {
      setCartLoading(true);
      setCartError("");

      const data = await getCart();
      setCartItems(normalizeCartResponse(data));
    } catch {
      setCartError("Impossible de charger le panier.");
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      loadCart();
    } else {
      setCartItems(getLocalCart());
    }
  }, [authLoading, isAuthenticated, user?.id]);

  useEffect(() => {
    if (!hasToken()) {
      saveLocalCart(cartItems);
    }
  }, [cartItems]);

  const addToCart = async (product) => {
    if (hasToken()) {
      try {
        setCartError("");

        const data = await addCartItem(product.id, 1);
        setCartItems(normalizeCartResponse(data));
        return true;
      } catch {
        setCartError("Impossible d'ajouter le produit au panier.");
        return false;
      }
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, item.stock || 999),
              }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          priceCents: product.priceCents,
          stock: product.stock,
          imageUrl: normalizeImage(product),
          translations: Array.isArray(product.translations)
            ? product.translations
            : [],
          quantity: 1,
        },
      ];
    });

    return true;
  };

  const increaseQty = async (productId) => {
    const item = cartItems.find((cartItem) => cartItem.id === productId);
    if (!item) return;

    const nextQuantity = Math.min(item.quantity + 1, item.stock || 999);

    if (hasToken() && item.cartItemId) {
      try {
        setCartError("");

        const data = await updateCartItem(item.cartItemId, nextQuantity);
        setCartItems(normalizeCartResponse(data));
      } catch {
        setCartError("Impossible de modifier la quantité.");
      }

      return;
    }

    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.id === productId
          ? { ...cartItem, quantity: nextQuantity }
          : cartItem
      )
    );
  };

  const decreaseQty = async (productId) => {
    const item = cartItems.find((cartItem) => cartItem.id === productId);
    if (!item) return;

    const nextQuantity = item.quantity - 1;

    if (hasToken() && item.cartItemId) {
      try {
        setCartError("");

        if (nextQuantity <= 0) {
          const data = await deleteCartItem(item.cartItemId);
          setCartItems(normalizeCartResponse(data));
        } else {
          const data = await updateCartItem(item.cartItemId, nextQuantity);
          setCartItems(normalizeCartResponse(data));
        }
      } catch {
        setCartError("Impossible de modifier la quantité.");
      }

      return;
    }

    setCartItems((prev) =>
      prev
        .map((cartItem) =>
          cartItem.id === productId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  const removeFromCart = async (productId) => {
    const item = cartItems.find((cartItem) => cartItem.id === productId);

    if (hasToken() && item?.cartItemId) {
      try {
        setCartError("");

        const data = await deleteCartItem(item.cartItemId);
        setCartItems(normalizeCartResponse(data));
      } catch {
        setCartError("Impossible de supprimer le produit du panier.");
      }

      return;
    }

    setCartItems((prev) => prev.filter((cartItem) => cartItem.id !== productId));
  };

  const clearCart = async () => {
    if (hasToken()) {
      try {
        setCartError("");

        const data = await clearCartApi();
        setCartItems(normalizeCartResponse(data));
      } catch {
        setCartError("Impossible de vider le panier.");
      }

      return;
    }

    setCartItems([]);
    saveLocalCart([]);
  };

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const totalPriceCents = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.priceCents * item.quantity,
      0
    );
  }, [cartItems]);

  const value = {
    cartItems,
    cartLoading,
    cartError,
    loadCart,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalItems,
    totalPriceCents,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}