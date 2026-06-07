import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminStatsCard from "../../components/admin/AdminStatsCard";
import SalesChart from "../../components/admin/SalesChart";
import CategoryPieChart from "../../components/admin/CategoryPieChart";
import { getAdminProducts, getAdminStats } from "../../api/adminApi";

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    activeProducts: 0,
    orders: 0,
    revenueCents: 0,
  });

  const [salesByDay, setSalesByDay] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [debugStats, setDebugStats] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [apiStats, products] = await Promise.all([
          getAdminStats(),
          getAdminProducts().catch(() => []),
        ]);

        setDebugStats(apiStats);

        setStats({
          products:
            apiStats.productsCount ??
            apiStats.products ??
            apiStats.totalProducts ??
            products.length,

          activeProducts:
            products.filter((item) => item.isActive).length,

          orders:
            apiStats.ordersCount ??
            apiStats.orders ??
            apiStats.totalOrders ??
            0,

          revenueCents:
            apiStats.revenueCents ??
            apiStats.totalRevenueCents ??
            0,
        });

        setSalesByDay(
          apiStats.salesByDay ||
            apiStats.dailySales ||
            []
        );

        setSalesByCategory(
          apiStats.salesByCategory ||
            apiStats.categorySales ||
            []
        );
      } catch (err) {
        console.error(err);
      }
    }

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Produits",
      value: String(stats.products),
      subtitle: "Produits gérés côté admin",
    },
    {
      title: "Produits actifs",
      value: String(stats.activeProducts),
      subtitle: "Visibles dans le catalogue",
    },
    {
      title: "Commandes",
      value: String(stats.orders),
      subtitle: "Commandes enregistrées",
    },
    {
      title: "Chiffre d'affaires",
      value: `${(stats.revenueCents / 100).toLocaleString("fr-FR")} €`,
      subtitle: "Total des ventes",
    },
  ];

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
  <div>
    <h1>Admin Dashboard</h1>
    <p>Vue d’ensemble de la partie administration.</p>
  </div>

  <div className="admin-dashboard-actions">
    <Link to="/admin/products" className="btn btn-primary">
      Gérer les produits
    </Link>

    <Link to="/admin/categories" className="btn btn-secondary">
  Gérer les catégories
</Link>

    <Link to="/admin/contact" className="btn btn-secondary">
      Messages contact
    </Link>
  </div>
</div>

        <div className="grid admin-stats-grid">
          {cards.map((card) => (
            <AdminStatsCard
              key={card.title}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
            />
          ))}
        </div>

        <div className="admin-dashboard-grid">
          <SalesChart
            title="Ventes par jour"
            data={salesByDay}
          />

          <SalesChart
            title="Ventes par catégorie"
            data={salesByCategory}
          />

          <CategoryPieChart
            title="Répartition des ventes par catégorie"
            data={salesByCategory}
          />
        </div>
      </section>
    </div>
  );
}

export default AdminDashboardPage;