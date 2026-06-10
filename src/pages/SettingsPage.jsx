import AccountSidebar from "../components/account/AccountSidebar";
import LanguageSelector from "../components/layout/LanguageSelector";
import { useI18n } from "../context/I18nContext";

function SettingsPage() {
  const { t } = useI18n();

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>{t("settingsTitle")}</h1>
            <p>{t("settingsSubtitle")}</p>
          </div>
        </div>

        <div className="account-layout">
          <AccountSidebar />

          <div className="account-sections">
            <div className="box">
              <h2>{t("languageSettingsTitle")}</h2>
              <p>{t("languageSettingsDescription")}</p>

              <div className="settings-item">
                <span>{t("chooseLanguage")}</span>
                <LanguageSelector />
              </div>
            </div>

            <div className="box">
              <h2>{t("securitySettingsTitle")}</h2>
              <p>{t("securitySettingsDescription")}</p>
            </div>

            <div className="box">
              <h2>{t("notificationSettingsTitle")}</h2>
              <p>{t("notificationSettingsDescription")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;