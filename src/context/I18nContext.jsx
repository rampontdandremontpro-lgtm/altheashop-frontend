import { createContext, useContext, useEffect, useMemo, useState } from "react";

const I18nContext = createContext(null);

const STORAGE_KEY = "althea_language";

const LANGUAGES = {
  fr: { label: "Français", dir: "ltr" },
  en: { label: "English", dir: "ltr" },
  ar: { label: "العربية", dir: "rtl" },
  he: { label: "עברית", dir: "rtl" },
};

const TRANSLATIONS = {
  fr: {
    home: "Accueil",
    catalog: "Catalogue",
    contact: "Contact",
    cart: "Panier",
    login: "Connexion",
    register: "Inscription",
    logout: "Déconnexion",
    account: "Mon compte",
    orders: "Mes commandes",
    settings: "Paramètres",
    admin: "Admin",
    search: "Recherche",
    about: "À propos",
    legal: "Mentions légales",
    terms: "CGU",
    language: "Langue",

    backHome: "Retour à l'accueil",
    mainNavigation: "Navigation principale",
    mobileNavigation: "Navigation mobile",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    skipToContent: "Aller au contenu principal",

    searchPlaceholder: "Rechercher un produit...",
    searchAria: "Rechercher un produit",
    searchButton: "Rechercher",

    navigation: "Navigation",
    information: "Informations",
    socialNetworks: "Réseaux sociaux",
    footerDescription:
      "Plateforme e-commerce spécialisée dans la vente de matériel médical professionnel.",
    rights: "Tous droits réservés.",
  },

  en: {
    home: "Home",
    catalog: "Catalog",
    contact: "Contact",
    cart: "Cart",
    login: "Login",
    register: "Register",
    logout: "Logout",
    account: "My account",
    orders: "My orders",
    settings: "Settings",
    admin: "Admin",
    search: "Search",
    about: "About",
    legal: "Legal notice",
    terms: "Terms",
    language: "Language",

    backHome: "Back to homepage",
    mainNavigation: "Main navigation",
    mobileNavigation: "Mobile navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to main content",

    searchPlaceholder: "Search for a product...",
    searchAria: "Search for a product",
    searchButton: "Search",

    navigation: "Navigation",
    information: "Information",
    socialNetworks: "Social networks",
    footerDescription:
      "E-commerce platform specialized in professional medical equipment.",
    rights: "All rights reserved.",
  },

  ar: {
    home: "الرئيسية",
    catalog: "الكتالوج",
    contact: "اتصل بنا",
    cart: "السلة",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    account: "حسابي",
    orders: "طلباتي",
    settings: "الإعدادات",
    admin: "الإدارة",
    search: "بحث",
    about: "حول الموقع",
    legal: "الإشعارات القانونية",
    terms: "شروط الاستخدام",
    language: "اللغة",

    backHome: "العودة إلى الصفحة الرئيسية",
    mainNavigation: "التنقل الرئيسي",
    mobileNavigation: "تنقل الهاتف",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    skipToContent: "الانتقال إلى المحتوى الرئيسي",

    searchPlaceholder: "ابحث عن منتج...",
    searchAria: "البحث عن منتج",
    searchButton: "بحث",

    navigation: "التنقل",
    information: "معلومات",
    socialNetworks: "الشبكات الاجتماعية",
    footerDescription:
      "منصة تجارة إلكترونية متخصصة في بيع المعدات الطبية المهنية.",
    rights: "جميع الحقوق محفوظة.",
  },

  he: {
    home: "בית",
    catalog: "קטלוג",
    contact: "צור קשר",
    cart: "עגלה",
    login: "התחברות",
    register: "הרשמה",
    logout: "התנתקות",
    account: "החשבון שלי",
    orders: "ההזמנות שלי",
    settings: "הגדרות",
    admin: "ניהול",
    search: "חיפוש",
    about: "אודות",
    legal: "מידע משפטי",
    terms: "תנאי שימוש",
    language: "שפה",

    backHome: "חזרה לדף הבית",
    mainNavigation: "ניווט ראשי",
    mobileNavigation: "ניווט במובייל",
    openMenu: "פתח תפריט",
    closeMenu: "סגור תפריט",
    skipToContent: "דלג לתוכן הראשי",

    searchPlaceholder: "חפש מוצר...",
    searchAria: "חפש מוצר",
    searchButton: "חפש",

    navigation: "ניווט",
    information: "מידע",
    socialNetworks: "רשתות חברתיות",
    footerDescription: "פלטפורמת מסחר אלקטרוני לציוד רפואי מקצועי.",
    rights: "כל הזכויות שמורות.",
  },
};

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "fr";
  });

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