import AdminStatsCard from "../../components/admin/AdminStatsCard";

function AdminDashboardPage() {
  const stats = [
    {
      title: "Produits",
      value: "24",
      subtitle: "Nombre total de produits",
    },
    {
      title: "Commandes",
      value: "12",
      subtitle: "Commandes récentes",
    },
    {
      title: "Chiffre d'affaires",
      value: "4 250 €",
      subtitle: "Valeur de démonstration",
    },
    {
      title: "Clients",
      value: "9",
      subtitle: "Utilisateurs enregistrés",
    },
  ];

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Base d’interface prête pour le futur backoffice.</p>
          </div>
        </div>

        <div className="grid admin-stats-grid">
          {stats.map((stat) => (
            <AdminStatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
            />
          ))}
        </div>

        <div className="box">
          <h2>À brancher plus tard</h2>
          <ul className="clean-list">
            <li>statistiques réelles depuis l’API admin</li>
            <li>graphiques ventes</li>
            <li>gestion commandes</li>
            <li>gestion utilisateurs</li>
            <li>stock et alertes</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboardPage;