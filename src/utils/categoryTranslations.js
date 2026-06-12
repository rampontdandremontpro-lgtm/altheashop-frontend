export function getTranslatedCategory(category, language) {
  if (!category) return null;

  const currentLanguage = (language || "fr").split("-")[0];

  if (currentLanguage === "fr") {
    return category;
  }

  const translation = Array.isArray(category.translations)
    ? category.translations.find(
        (item) => item.language === currentLanguage
      )
    : null;

  return {
    ...category,
    name: translation?.name || category.name,
    description: translation?.description || category.description,
  };
}