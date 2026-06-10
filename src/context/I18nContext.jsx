import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { TRANSLATIONS } from "../i18n/translations";

const I18nContext = createContext(null);

const STORAGE_KEY = "althea_language";

const LANGUAGES = {
  fr: { label: "Français", dir: "ltr" },
  en: { label: "English", dir: "ltr" },
  ar: { label: "العربية", dir: "rtl" },
  he: { label: "עברית", dir: "rtl" },
};

function getInitialLanguage() {
  const savedLanguage = localStorage.getItem(STORAGE_KEY);

  if (savedLanguage && TRANSLATIONS[savedLanguage]) {
    return savedLanguage;
  }

  return "fr";
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  const dir = LANGUAGES[language]?.dir || "ltr";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      dir,
      languages: LANGUAGES,
      t: (key) => TRANSLATIONS[language]?.[key] || TRANSLATIONS.fr[key] || key,
    }),
    [language, dir]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}