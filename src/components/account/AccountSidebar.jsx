import { NavLink } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";

function AccountSidebar() {
  const { t } = useI18n();

  return (
    <aside className="box account-sidebar">
      <h2>{t("customerArea")}</h2>

      <nav className="account-sidebar-nav">
        <NavLink to="/account">{t("myProfile")}</NavLink>
        <NavLink to="/orders">{t("myOrders")}</NavLink>
        <NavLink to="/settings">{t("settings")}</NavLink>
        <NavLink to="/cart">{t("cart")}</NavLink>
      </nav>
    </aside>
  );
}

export default AccountSidebar;