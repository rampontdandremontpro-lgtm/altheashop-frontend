import { Outlet } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  const { t } = useI18n();

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        {t("skipToContent")}
      </a>

      <Header />

      <main id="main-content" className="main-content container" tabIndex="-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;