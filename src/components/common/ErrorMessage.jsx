import { useI18n } from "../../context/I18nContext";

function ErrorMessage({ message }) {
  const { t } = useI18n();

  return (
    <div className="box error-box">
      {message || t("genericError")}
    </div>
  );
}

export default ErrorMessage;