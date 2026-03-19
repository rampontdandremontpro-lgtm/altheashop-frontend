import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="main-content container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;