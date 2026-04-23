import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AccountSidebar from "../components/account/AccountSidebar";

function AccountPage() {
  const { user } = useAuth();

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Mon compte</h1>
            <p>Bienvenue {user?.firstName}.</p>
          </div>
        </div>

        <div className="account-layout">
          <AccountSidebar />

          <div>
            <div className="box">
              <h2>Informations personnelles</h2>

              <div className="account-summary-list">
                <div className="account-summary-row">
                  <span>Prénom</span>
                  <strong>{user?.firstName || "-"}</strong>
                </div>

                <div className="account-summary-row">
                  <span>Nom</span>
                  <strong>{user?.lastName || "-"}</strong>
                </div>

                <div className="account-summary-row">
                  <span>Email</span>
                  <strong>{user?.email || "-"}</strong>
                </div>

                <div className="account-summary-row">
                  <span>Téléphone</span>
                  <strong>{user?.phone || "-"}</strong>
                </div>
              </div>

              <div className="detail-box">
                <Link to="/account/edit" className="btn btn-primary">
                  Modifier
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AccountPage;