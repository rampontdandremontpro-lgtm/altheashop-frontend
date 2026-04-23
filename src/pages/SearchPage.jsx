import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategories, getProducts } from "../api/catalogApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import ProductCard from "../components/catalog/ProductCard";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialSort = searchParams.get("sort") || "relevance";
  const initialMinPrice = searchParams.get("minPriceCents") || "";
  const initialMaxPrice = searchParams.get("maxPriceCents") || "";
  const initialInStock = searchParams.get("inStock") === "true";
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
    inStock: initialInStock,
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
        };

        if (initialQuery.trim()) params.q = initialQuery.trim();
        if (filters.category) params.category = filters.category;
        if (filters.inStock) params.inStock = true;
        if (filters.minPriceCents) {
          params.minPriceCents = Number(filters.minPriceCents);
        }
        if (filters.maxPriceCents) {
          params.maxPriceCents = Number(filters.maxPriceCents);
        }

        const data = await getProducts(params);
        setProductsData(data);
      } catch (err) {
        setError("Impossible de charger les résultats de recherche.");
      } finally {
        setLoading(false);
      }
    }

    fetchProductsData();
  }, [page, filters, initialQuery]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (initialQuery.trim()) params.set("q", initialQuery.trim());
    if (filters.category) params.set("category", filters.category);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.inStock) params.set("inStock", "true");
    if (filters.minPriceCents) params.set("minPriceCents", filters.minPriceCents);
    if (filters.maxPriceCents) params.set("maxPriceCents", filters.maxPriceCents);
    if (page > 1) params.set("page", String(page));

    setSearchParams(params, { replace: true });
  }, [filters, page, initialQuery, setSearchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setPage(1);
  };

  const handleReset = () => {
    setFilters({
      category: "",
      sort: "relevance",
      inStock: false,
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
            <h1>Recherche</h1>
            <p>
              {initialQuery.trim()
                ? `Résultats pour "${initialQuery.trim()}" — ${productsData.total} produit(s)`
                : `${productsData.total} produit(s) trouvés`}
            </p>
          </div>
        </div>

        <div className="filters filters-advanced search-filters-only">
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="">Toutes les catégories</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>

          <select name="sort" value={filters.sort} onChange={handleChange}>
            <option value="relevance">Pertinence</option>
            <option value="priority">Priorité</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="name_asc">Nom A-Z</option>
            <option value="name_desc">Nom Z-A</option>
          </select>

          <input
            type="number"
            name="minPriceCents"
            placeholder="Prix min (centimes)"
            value={filters.minPriceCents}
            onChange={handleChange}
            min="0"
          />

          <input
            type="number"
            name="maxPriceCents"
            placeholder="Prix max (centimes)"
            value={filters.maxPriceCents}
            onChange={handleChange}
            min="0"
          />

          <label className="checkbox-inline">
            <input
              type="checkbox"
              name="inStock"
              checked={filters.inStock}
              onChange={handleChange}
            />
            En stock
          </label>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            Réinitialiser
          </button>
        </div>
      </section>

      {loading && <Loader text="Chargement des résultats..." />}
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
                title="Aucun produit trouvé"
                message="Essaie de modifier les filtres ou de faire une nouvelle recherche depuis la barre du haut."
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