import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCategoryBySlug,
  getProducts,
} from "../api/catalogApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Pagination from "../components/common/Pagination";
import ProductCard from "../components/catalog/ProductCard";
import ProductFilters from "../components/catalog/ProductFilters";
import { useI18n } from "../context/I18nContext";

function CategoriesPage() {
  const { t } = useI18n();
  const { slug } = useParams();

  const [category, setCategory] = useState(null);

  const [productsData, setProductsData] = useState({
    items: [],
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategoryAndProducts() {
      try {
        setLoading(true);
        setError("");

        const params = {
          category: slug,
          page,
          pageSize: 12,
          sort,
        };

        if (search.trim()) {
          params.q = search.trim();
        }

        if (inStock) {
          params.inStock = true;
        }

        const [categoryData, products] = await Promise.all([
          getCategoryBySlug(slug),
          getProducts(params),
        ]);

        setCategory(categoryData);
        setProductsData(products);
      } catch {
        setError(t("categoryProductsLoadError"));
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryAndProducts();
  }, [slug, page, search, sort, inStock, t]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setSort("relevance");
    setInStock(false);
    setPage(1);
  };

  if (loading) return <Loader text={t("loadingCatalog")} />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="section">
        <div className="category-header">
          {category?.imageUrl ? (
            <div className="category-banner">
              <img
                src={category.imageUrl}
                alt={category.name || slug}
                className="category-banner-image"
              />

              <div className="category-banner-overlay">
                <p className="hero-kicker">{t("categoryTitle")}</p>
                <h1>{category.name || slug}</h1>
              </div>
            </div>
          ) : (
            <div className="box">
              <h1>
                {t("categoryTitle")} : {category?.name || slug}
              </h1>
            </div>
          )}

          {category?.description && (
            <div className="box category-description">
              <p>{category.description}</p>
            </div>
          )}
        </div>

        <ProductFilters
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          inStock={inStock}
          setInStock={setInStock}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
      </section>

      <section className="section">
        {productsData.items.length === 0 ? (
          <div className="box">{t("noProductsFound")}</div>
        ) : (
          <div className="grid cards-grid">
            {productsData.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Pagination
        page={productsData.page}
        totalPages={productsData.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default CategoriesPage;