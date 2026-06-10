import { useEffect, useState } from "react";
import { getPublicHomeData } from "../api/homeApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Carousel from "../components/home/Carousel";
import CategoryCard from "../components/home/CategoryCard";
import ProductCard from "../components/catalog/ProductCard";
import { useI18n } from "../context/I18nContext";

function HomePage() {
  const { t } = useI18n();

  const [data, setData] = useState({
    slides: [],
    homeText: "",
    categories: [],
    featured: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const result = await getPublicHomeData();
        setData(result);
      } catch {
        setError(t("homeLoadError"));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [t]);

  if (loading) return <Loader text={t("homeLoading")} />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <Carousel slides={data.slides} />

      {data.homeText && (
        <section className="section">
          <h2>{t("homePresentationTitle")}</h2>
          <div className="box">
            <p>{data.homeText}</p>
          </div>
        </section>
      )}

      <section className="section">
        <h2>{t("homeCategoriesTitle")}</h2>

        {data.categories.length === 0 ? (
          <div className="box">{t("homeNoCategories")}</div>
        ) : (
          <div className="grid cards-grid">
            {data.categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>{t("homeFeaturedTitle")}</h2>

        {data.featured.length === 0 ? (
          <div className="box">{t("homeNoFeaturedProducts")}</div>
        ) : (
          <div className="grid cards-grid">
            {data.featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;