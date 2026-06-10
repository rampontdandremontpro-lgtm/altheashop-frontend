import { useI18n } from "../../context/I18nContext";

function EmptyState({
  title,
  message,
}) {
  const { t } = useI18n();

  return (
    <div className="box empty-state">
      <h3>{title || t("emptyStateTitle")}</h3>
      <p>{message || t("emptyStateMessage")}</p>
    </div>
  );
}

export default EmptyState;