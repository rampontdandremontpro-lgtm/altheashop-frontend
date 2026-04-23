import { useEffect, useState } from "react";
import AdminStatsCard from "../../components/admin/AdminStatsCard";
import { getAdminProducts } from "../../api/adminApi";
import { getOrders } from "../../api/ordersApi";

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    activeProducts: 0,
    orders: 0,
    revenueCents: 0,
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [products, orders] = await Promise.all([
          getAdminProducts(),
          getOrders().catch(() => []),
        ]);

        const revenueCents = orders.reduce(
          (sum, order) => sum + (order.totalPriceCents || 0),
          0
        );

        setStats({
          products: products.length,
          activeProducts: products.filter((item) => item.isActive).length,
          orders: orders.length,
          revenueCents,
        });
      } catch {
        setStats({
          products: 0,
          activeProducts: 0,
          orders: 0,
          revenueCents: 0,
        });
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
      subtitle: "Visibles dans la démo admin",
    },
    {
      title: "Commandes",
      value: String(stats.orders),
      subtitle: "Historique commandes actuel",
    },
    {
      title: "Chiffre d'affaires",
      value: `${(stats.revenueCents / 100).toLocaleString("fr-FR")} €`,
      subtitle: "Calcul local de démonstration",
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

        <div className="box">
          <h2>État de l'administration</h2>
          <ul className="clean-list">
            <li>accès protégé par rôle admin</li>
            <li>liste produits administrable</li>
            <li>création et modification produit côté UI</li>
            <li>suppression produit côté UI</li>
            <li>structure prête pour brancher l’API backend</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboardPage;