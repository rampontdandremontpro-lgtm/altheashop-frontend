import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import PrivateRoute from "../components/auth/PrivateRoute";
import HomePage from "../pages/HomePage";
import CatalogPage from "../pages/CatalogPage";
import CategoriesPage from "../pages/CategoriesPage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import AccountPage from "../pages/AccountPage";
import OrdersPage from "../pages/OrdersPage";
import CheckoutPage from "../pages/CheckoutPage";
import NotFoundPage from "../pages/NotFoundPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="categories/:slug" element={<CategoriesPage />} />
        <Route path="product/:slug" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="checkout" element={<CheckoutPage />} />

        <Route
          path="account"
          element={
            <PrivateRoute>
              <AccountPage />
            </PrivateRoute>
          }
        />

        <Route
          path="orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />

        <Route
          path="admin"
          element={
            <PrivateRoute>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="admin/products"
          element={
            <PrivateRoute>
              <AdminProductsPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;