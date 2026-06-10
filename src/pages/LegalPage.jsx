import { useI18n } from "../context/I18nContext";

function LegalPage() {
  const { t } = useI18n();

  return (
    <div className="page-stack">
      <section className="section">
        <div className="box legal-content">
          <h1>{t("legalTitle")}</h1>

          <h2>{t("legalEditorTitle")}</h2>
          <p>{t("legalEditorText")}</p>

          <h2>{t("legalManagersTitle")}</h2>
          <p>{t("legalManagersText")}</p>

          <h2>{t("legalHostingTitle")}</h2>
          <p>{t("legalHostingText")}</p>

          <h2>{t("legalIntellectualPropertyTitle")}</h2>
          <p>{t("legalIntellectualPropertyText")}</p>

          <h2>{t("legalPersonalDataTitle")}</h2>
          <p>{t("legalPersonalDataText")}</p>
        </div>
      </section>
    </div>
  );
}

export default LegalPage;