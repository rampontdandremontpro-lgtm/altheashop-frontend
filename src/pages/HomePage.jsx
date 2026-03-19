import { useEffect, useState } from "react";
import { getHomeData } from "../api/catalogApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Hero from "../components/home/Hero";
import CategoryCard from "../components/home/CategoryCard";
import ProductCard from "../components/catalog/ProductCard";

function HomePage() {
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
        const result = await getHomeData();
        setData(result);
      } catch (err) {
        setError("Impossible de charger la page d'accueil.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <Loader text="Chargement de l'accueil..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <Hero />

      {data.homeText && (
        <section className="section">
          <h2>Présentation</h2>
          <div className="box">
            <p>{data.homeText}</p>
          </div>
        </section>
      )}

      <section className="section">
        <h2>Catégories</h2>
        <div className="grid cards-grid">
          {data.categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Produits mis en avant</h2>
        <div className="grid cards-grid">
          {data.featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;