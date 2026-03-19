import { useEffect, useMemo, useState } from "react";
import { getCategories, getProducts } from "../api/catalogApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import ProductCard from "../components/catalog/ProductCard";

function CatalogPage() {
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
    q: "",
    category: "",
    sort: "relevance",
    inStock: false,
    minPriceCents: "",
    maxPriceCents: "",
  });

  const [page, setPage] = useState(1);

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

        if (filters.q.trim()) params.q = filters.q.trim();
        if (filters.category) params.category = filters.category;
        if (filters.inStock) params.inStock = true;
        if (filters.minPriceCents) params.minPriceCents = Number(filters.minPriceCents);
        if (filters.maxPriceCents) params.maxPriceCents = Number(filters.maxPriceCents);

        const data = await getProducts(params);
        setProductsData(data);
      } catch (err) {
        setError("Impossible de charger le catalogue.");
      } finally {
        setLoading(false);
      }
    }

    fetchProductsData();
  }, [page, filters]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleReset = () => {
    setFilters({
      q: "",
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
            <h1>Catalogue</h1>
            <p>{productsData.total} produit(s)</p>
          </div>
        </div>

        <form className="filters filters-advanced" onSubmit={handleSubmit}>
          <input
            type="text"
            name="q"
            placeholder="Rechercher un produit..."
            value={filters.q}
            onChange={handleChange}
          />

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

          <button type="submit" className="btn btn-primary">
            Appliquer
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            Réinitialiser
          </button>
        </form>
      </section>

      {loading && <Loader text="Chargement du catalogue..." />}
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
                message="Essaie de modifier les filtres ou la recherche."
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

export default CatalogPage;