import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../api/catalogApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Pagination from "../components/common/Pagination";
import ProductCard from "../components/catalog/ProductCard";
import ProductFilters from "../components/catalog/ProductFilters";

function CategoriesPage() {
  const { slug } = useParams();

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
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const params = {
          category: slug,
          page,
          pageSize: 12,
          sort,
        };

        if (search.trim()) params.q = search.trim();
        if (inStock) params.inStock = true;

        const data = await getProducts(params);
        setProductsData(data);
      } catch (err) {
        setError("Impossible de charger les produits de cette catégorie.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [slug, page, search, sort, inStock]);

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

  if (loading) return <Loader text="Chargement des produits..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="section">
        <h1>Catégorie : {slug}</h1>

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
          <div className="box">Aucun produit trouvé.</div>
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