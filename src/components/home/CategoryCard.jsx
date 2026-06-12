import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import { getTranslatedCategory } from "../../utils/categoryTranslations";

function CategoryCard({ category }) {
  const { t, language } = useI18n();

  const translatedCategory = getTranslatedCategory(
    category,
    language
  );

  return (
    <Link
      to={`/categories/${translatedCategory.slug}`}
      className="card"
    >
      <div className="card-image-wrapper">
        {translatedCategory.imageUrl ? (
          <img
            src={translatedCategory.imageUrl}
            alt={translatedCategory.name}
            className="card-image"
          />
        ) : (
          <div className="image-placeholder">
            {t("imageUnavailable")}
          </div>
        )}
      </div>

      <div className="card-body">
        <h3>{translatedCategory.name}</h3>

        <p>
          {translatedCategory.description ||
            t("discoverCategory")}
        </p>
      </div>
    </Link>
  );
}

export default CategoryCard;