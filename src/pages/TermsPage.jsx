import { useI18n } from "../context/I18nContext";

function TermsPage() {
  const { t } = useI18n();

  return (
    <div className="page-stack">
      <section className="section">
        <div className="box legal-content">
          <h1>{t("termsTitle")}</h1>

          <h2>{t("termsPurposeTitle")}</h2>
          <p>{t("termsPurposeText")}</p>

          <h2>{t("termsAccessTitle")}</h2>
          <p>{t("termsAccessText")}</p>

          <h2>{t("termsAccountTitle")}</h2>
          <p>{t("termsAccountText")}</p>

          <h2>{t("termsResponsibilityTitle")}</h2>
          <p>{t("termsResponsibilityText")}</p>

          <h2>{t("termsEvolutionTitle")}</h2>
          <p>{t("termsEvolutionText")}</p>
        </div>
      </section>
    </div>
  );
}

export default TermsPage;