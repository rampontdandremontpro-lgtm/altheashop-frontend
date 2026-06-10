import { useI18n } from "../context/I18nContext";

function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="page-stack">
      <section className="section">
        <div className="box">
          <h1>{t("aboutTitle")}</h1>

          <p>{t("aboutParagraph1")}</p>

          <p>{t("aboutParagraph2")}</p>

          <p>{t("aboutParagraph3")}</p>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;