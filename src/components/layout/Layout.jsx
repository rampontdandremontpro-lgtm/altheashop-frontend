import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
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