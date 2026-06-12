import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import PrivateRoute from "../components/auth/PrivateRoute";
import AdminRoute from "../components/admin/AdminRoute";
import HomePage from "../pages/HomePage";
import CatalogPage from "../pages/CatalogPage";
import CategoriesPage from "../pages/CategoriesPage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import AccountPage from "../pages/AccountPage";
import AccountEditPage from "../pages/AccountEditPage";
import OrdersPage from "../pages/OrdersPage";
import CheckoutPage from "../pages/CheckoutPage";
import CheckoutSuccessPage from "../pages/CheckoutSuccessPage";
import ContactPage from "../pages/ContactPage";
import AboutPage from "../pages/AboutPage";
import LegalPage from "../pages/LegalPage";
import TermsPage from "../pages/TermsPage";
import SettingsPage from "../pages/SettingsPage";
import SearchPage from "../pages/SearchPage";
import NotFoundPage from "../pages/NotFoundPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminProductCreatePage from "../pages/admin/AdminProductCreatePage";
import AdminProductEditPage from "../pages/admin/AdminProductEditPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import AdminContactMessagesPage from "../pages/admin/AdminContactMessagesPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminCategoryCreatePage from "../pages/admin/AdminCategoryCreatePage";
import AdminCategoryEditPage from "../pages/admin/AdminCategoryEditPage";
import AdminHomePage from "../pages/admin/AdminHomePage";
import AdminSlideCreatePage from "../pages/admin/AdminSlideCreatePage";
import AdminSlideEditPage from "../pages/admin/AdminSlideEditPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "../pages/admin/AdminOrderDetailPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminUserEditPage from "../pages/admin/AdminUserEditPage";
import AdminChatbotMessagesPage from "../pages/admin/AdminChatbotMessagesPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import AdminTwoFactorPage from "../pages/AdminTwoFactorPage";
import AdminChatbotEscalationsPage from "../pages/admin/AdminChatbotEscalationsPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="categories/:slug" element={<CategoriesPage />} />
        <Route path="product/:slug" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="legal" element={<LegalPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="admin-2fa" element={<AdminTwoFactorPage />} />
        <Route path="account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
        <Route path="account/edit" element={<PrivateRoute> <AccountEditPage /></PrivateRoute>} />
        <Route path="orders" element={<PrivateRoute><OrdersPage /></PrivateRoute> } />
        <Route path="orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>}/>
        <Route path="settings" element={<PrivateRoute><SettingsPage /></PrivateRoute> } />
        <Route path="admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        <Route path="admin/home" element={<AdminRoute><AdminHomePage /></AdminRoute>} />
        <Route path="admin/home/slides/new" element={<AdminRoute><AdminSlideCreatePage /></AdminRoute>} />
        <Route path="admin/home/slides/:id/edit" element={<AdminRoute><AdminSlideEditPage /></AdminRoute>} />
        <Route path="admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute> } />
        <Route path="admin/products/new" element={<AdminRoute><AdminProductCreatePage /></AdminRoute>} />
        <Route path="admin/products/:id/edit" element={<AdminRoute><AdminProductEditPage /></AdminRoute>} />
        <Route path="admin/categories/new" element={<AdminRoute><AdminCategoryCreatePage /></AdminRoute>} />
        <Route path="admin/categories/:id/edit" element={<AdminRoute><AdminCategoryEditPage /></AdminRoute>} />
        <Route path="admin/chatbot" element={<AdminRoute><AdminChatbotMessagesPage /></AdminRoute>}/>
        <Route path="admin/contact" element={<AdminRoute><AdminContactMessagesPage /></AdminRoute>}s/>
        <Route path="admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
        <Route path="admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
        <Route path="admin/orders/:id" element={<AdminRoute><AdminOrderDetailPage /></AdminRoute>} />
        <Route path="admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
        <Route path="admin/users/:id/edit" element={<AdminRoute><AdminUserEditPage /></AdminRoute>} />
        <Route path="admin/chatbot/escalations" element={<AdminRoute><AdminChatbotEscalationsPage /></AdminRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;