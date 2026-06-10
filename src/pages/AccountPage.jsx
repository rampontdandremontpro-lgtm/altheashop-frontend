import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AccountSidebar from "../components/account/AccountSidebar";
import { useI18n } from "../context/I18nContext";

function AccountPage() {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>{t("accountTitle")}</h1>
            <p>
              {t("accountWelcome")} {user?.firstName}.
            </p>
          </div>
        </div>

        <div className="account-layout">
          <AccountSidebar />

          <div>
            <div className="box">
              <h2>{t("personalInformation")}</h2>

              <div className="account-summary-list">
                <div className="account-summary-row">
                  <span>{t("firstName")}</span>
                  <strong>{user?.firstName || "-"}</strong>
                </div>

                <div className="account-summary-row">
                  <span>{t("lastName")}</span>
                  <strong>{user?.lastName || "-"}</strong>
                </div>

                <div className="account-summary-row">
                  <span>{t("email")}</span>
                  <strong>{user?.email || "-"}</strong>
                </div>

                <div className="account-summary-row">
                  <span>{t("phone")}</span>
                  <strong>{user?.phone || "-"}</strong>
                </div>
              </div>

              <div className="detail-box">
                <Link to="/account/edit" className="btn btn-primary">
                  {t("edit")}
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