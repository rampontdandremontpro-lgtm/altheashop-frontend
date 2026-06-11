import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategories, getProducts } from "../api/catalogApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import ProductCard from "../components/catalog/ProductCard";
import { useI18n } from "../context/I18nContext";

function getTranslatedCategoryName(category, language) {
  const shortLanguage = (language || "fr").split("-")[0].toLowerCase();

  if (shortLanguage === "fr") {
    return category.name;
  }

  const translation = category.translations?.find(
    (item) => item.language === shortLanguage
  );

  return translation?.name || category.name;
}

function SearchPage() {
  const { t, language } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialSort = searchParams.get("sort") || "priority";
  const initialAvailability = searchParams.get("availability") || "all";
  const initialMatchMode = searchParams.get("matchMode") || "auto";
  const initialMinPrice = searchParams.get("minPriceCents") || "";
  const initialMaxPrice = searchParams.get("maxPriceCents") || "";
  const initialPage = Number(searchParams.get("page") || 1);

  const [productsData, setProductsData] = useState({
    items: [],
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 1,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    category: initialCategory,
    sort: initialSort,
    availability: initialAvailability,
    matchMode: initialMatchMode,
    minPriceCents: initialMinPrice,
    maxPriceCents: initialMaxPrice,
  });

  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    async function fetchCategoriesData() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    }

    fetchCategoriesData();
  }, []);

  useEffect(() => {
    async function fetchProductsData() {
      try {
        setLoading(true);
        setError("");

        const params = {
          page,
          pageSize: 12,
          sort: filters.sort,
          matchMode: filters.matchMode,
        };

        if (initialQuery.trim()) params.q = initialQuery.trim();
        if (filters.category) params.category = filters.category;
        if (filters.availability !== "all") {
          params.availability = filters.availability;
        }
        if (filters.minPriceCents) {
          params.minPriceCents = Number(filters.minPriceCents);
        }
        if (filters.maxPriceCents) {
          params.maxPriceCents = Number(filters.maxPriceCents);
        }

        const data = await getProducts(params);
        setProductsData(data);
      } catch {
        setError(t("loadSearchError"));
      } finally {
        setLoading(false);
      }
    }

    fetchProductsData();
  }, [page, filters, initialQuery, t]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (initialQuery.trim()) params.set("q", initialQuery.trim());
    if (filters.category) params.set("category", filters.category);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.availability !== "all") {
      params.set("availability", filters.availability);
    }
    if (filters.matchMode !== "auto") {
      params.set("matchMode", filters.matchMode);
    }
    if (filters.minPriceCents) {
      params.set("minPriceCents", filters.minPriceCents);
    }
    if (filters.maxPriceCents) {
      params.set("maxPriceCents", filters.maxPriceCents);
    }
    if (page > 1) params.set("page", String(page));

    setSearchParams(params, { replace: true });
  }, [filters, page, initialQuery, setSearchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPage(1);
  };

  const handleReset = () => {
    setFilters({
      category: "",
      sort: "priority",
      availability: "all",
      matchMode: "auto",
      minPriceCents: "",
      maxPriceCents: "",
    });

    setPage(1);
  };

  const categoryOptions = useMemo(() => categories || [], [categories]);

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>{t("searchPageTitle")}</h1>
            <p>
              {initialQuery.trim()
                ? `${t("searchResultsFor")} "${initialQuery.trim()}" — ${
                    productsData.total
                  } ${t("productsFound")}`
                : `${productsData.total} ${t("productsFound")}`}
            </p>
          </div>
        </div>

        <div className="filters filters-advanced search-filters-only">
          <select
            name="matchMode"
            value={filters.matchMode}
            onChange={handleChange}
          >
            <option value="auto">{t("matchAuto")}</option>
            <option value="exact">{t("matchExact")}</option>
            <option value="one_char_diff">{t("matchOneCharDiff")}</option>
            <option value="starts_with">{t("matchStartsWith")}</option>
            <option value="contains">{t("matchContains")}</option>
          </select>

          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="">{t("allCategories")}</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.slug}>
                {getTranslatedCategoryName(category, language)}
              </option>
            ))}
          </select>

          <select name="sort" value={filters.sort} onChange={handleChange}>
            <option value="priority">{t("sortPriority")}</option>
            <option value="newest">{t("sortNewest")}</option>
            <option value="oldest">{t("sortOldest")}</option>
            <option value="price_asc">{t("sortPriceAsc")}</option>
            <option value="price_desc">{t("sortPriceDesc")}</option>
            <option value="name_asc">{t("sortNameAsc")}</option>
            <option value="name_desc">{t("sortNameDesc")}</option>
            <option value="stock_desc">{t("sortStockDesc")}</option>
            <option value="stock_asc">{t("sortStockAsc")}</option>
          </select>

          <select
            name="availability"
            value={filters.availability}
            onChange={handleChange}
          >
            <option value="all">{t("allAvailabilities")}</option>
            <option value="in_stock">{t("inStock")}</option>
            <option value="out_of_stock">{t("outOfStock")}</option>
          </select>

          <input
            type="number"
            name="minPriceCents"
            placeholder={t("minPricePlaceholder")}
            value={filters.minPriceCents}
            onChange={handleChange}
            min="0"
          />

          <input
            type="number"
            name="maxPriceCents"
            placeholder={t("maxPricePlaceholder")}
            value={filters.maxPriceCents}
            onChange={handleChange}
            min="0"
          />

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            {t("resetFilters")}
          </button>
        </div>
      </section>

      {loading && <Loader text={t("loadingSearchResults")} />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <>
          <section className="section">
            {productsData.items.length > 0 ? (
              <div className="grid cards-grid">
                {productsData.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                title={t("noProductsFound")}
                message={t("noProductsFoundMessage")}
              />
            )}
          </section>

          <Pagination
            page={productsData.page}
            totalPages={productsData.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default SearchPage;