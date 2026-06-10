import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext";

function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="page-stack">
      <section className="section">
        <div className="box empty-state">
          <h1>{t("notFoundTitle")}</h1>

          <p>{t("notFoundMessage")}</p>

          <Link to="/" className="btn btn-primary">
            {t("backHome")}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default NotFoundPage;