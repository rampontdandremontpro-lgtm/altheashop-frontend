import { useI18n } from "../../context/I18nContext";

function LanguageSelector() {
  const { language, setLanguage, languages, t } = useI18n();

  return (
    <label className="language-selector">
      <span className="sr-only">{t("language")}</span>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label={t("language")}
      >
        {Object.entries(languages).map(([code, config]) => (
          <option key={code} value={code}>
            {config.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default LanguageSelector;