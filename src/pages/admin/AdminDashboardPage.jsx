import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminStatsCard from "../../components/admin/AdminStatsCard";
import SalesChart from "../../components/admin/SalesChart";
import CategoryPieChart from "../../components/admin/CategoryPieChart";
import AverageBasketChart from "../../components/admin/AverageBasketChart";
import { getAdminProducts, getAdminStats } from "../../api/adminApi";

function AdminDashboardPage() {
  const [period, setPeriod] = useState("7d");

  const [stats, setStats] = useState({
    products: 0,
    activeProducts: 0,
    orders: 0,
    revenueCents: 0,
  });

  const [salesByDay, setSalesByDay] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const [apiStats, products] = await Promise.all([
          getAdminStats(period),
          getAdminProducts().catch(() => []),
        ]);

        setStats({
          products:
            apiStats.productsCount ??
            apiStats.products ??
            apiStats.totalProducts ??
            products.length,

          activeProducts: products.filter((item) => item.isActive).length,

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

        setSalesByDay(apiStats.salesByDay || apiStats.dailySales || []);
        setSalesByCategory(
          apiStats.salesByCategory || apiStats.categorySales || []
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [period]);

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
      subtitle: period === "7d" ? "Sur 7 jours" : "Sur 5 semaines",
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
            <Link to="/admin/home" className="btn btn-primary">
              Gérer l'accueil
            </Link>

            <Link to="/admin/products" className="btn btn-primary">
              Gérer les produits
            </Link>

            <Link to="/admin/categories" className="btn btn-primary">
              Gérer les catégories
            </Link>

            <Link to="/admin/orders" className="btn btn-primary">
              Gérer les commandes
            </Link>

            <Link to="/admin/users" className="btn btn-primary">
              Gérer les utilisateurs
            </Link>

            <Link to="/admin/chatbot/escalations" className="btn btn-secondary">
  Demandes chatbot
</Link>

            <Link to="/admin/contact" className="btn btn-secondary">
              Messages contact
            </Link>

            <Link to="/admin/chatbot" className="btn btn-secondary">
  Conversations chatbot
</Link>
          </div>
        </div>

        <div className="box admin-dashboard-toolbar">
          <div>
            <h2>Statistiques</h2>
            <p>
              {period === "7d"
                ? "Données des 7 derniers jours"
                : "Données des 5 dernières semaines"}
            </p>
          </div>

          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="7d">7 derniers jours</option>
            <option value="5w">5 dernières semaines</option>
          </select>
        </div>

        {loading ? (
          <div className="box">Chargement du dashboard...</div>
        ) : (
          <>
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
                title={
                  period === "7d"
                    ? "Ventes par jour"
                    : "Ventes par semaine"
                }
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

              <AverageBasketChart
                title="Panier moyen par catégorie"
                data={salesByCategory}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default AdminDashboardPage;