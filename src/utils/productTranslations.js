const SUPPORTED_LANGUAGES = ["fr", "en", "ar", "he"];

export function getSafeProductLanguage(language) {
  const shortLanguage = (language || "fr").split("-")[0].toLowerCase();

  return SUPPORTED_LANGUAGES.includes(shortLanguage) ? shortLanguage : "fr";
}

export function getTranslatedProduct(product, language) {
  if (!product) return product;

  const safeLanguage = getSafeProductLanguage(language);

  if (safeLanguage === "fr") {
    return product;
  }

  const translation = product.translations?.find(
    (item) => item.language === safeLanguage
  );

  if (!translation) {
    return product;
  }

  return {
    ...product,
    name: translation.name || product.name,
    shortDescription:
      translation.shortDescription || product.shortDescription,
    description: translation.description || product.description,
    techSpecs: translation.techSpecs || product.techSpecs,
  };
}