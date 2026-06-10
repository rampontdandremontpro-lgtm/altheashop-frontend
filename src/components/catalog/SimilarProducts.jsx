import { useEffect, useState } from "react";
import { getProducts } from "../../api/catalogApi";
import ProductCard from "./ProductCard";
import { useI18n } from "../../context/I18nContext";

function SimilarProducts({ product }) {
  const { t } = useI18n();
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    async function loadSimilarProducts() {
      if (!product?.category?.slug) return;

      try {
        const data = await getProducts({
          category: product.category.slug,
          page: 1,
          pageSize: 12,
          availability: "in_stock",
          sort: "priority",
        });

        const filtered = (data.items || [])
          .filter((item) => item.id !== product.id)
          .slice(0, 6);

        setSimilarProducts(filtered);
      } catch {
        setSimilarProducts([]);
      }
    }

    loadSimilarProducts();
  }, [product]);

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <section className="section">
      <div className="page-heading">
        <div>
          <h2>{t("similarProducts")}</h2>
          <p>{t("similarProductsDescription")}</p>
        </div>
      </div>

      <div className="grid cards-grid">
        {similarProducts.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}

export default SimilarProducts;