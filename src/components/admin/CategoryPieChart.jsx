function formatPrice(cents) {
  return `${(Number(cents || 0) / 100).toLocaleString("fr-FR")} €`;
}

function CategoryPieChart({ title, data = [] }) {
  const total = data.reduce(
    (sum, item) => sum + Number(item.totalCents || 0),
    0
  );

  let cumulative = 0;

  const gradientParts = data.map((item, index) => {
    const start = total > 0 ? (cumulative / total) * 100 : 0;
    cumulative += Number(item.totalCents || 0);
    const end = total > 0 ? (cumulative / total) * 100 : 0;

    return `var(--chart-${(index % 5) + 1}) ${start}% ${end}%`;
  });

  const background =
    total > 0
      ? `conic-gradient(${gradientParts.join(", ")})`
      : "conic-gradient(#e5e7eb 0% 100%)";

  return (
    <div className="box admin-chart-card">
      <h2>{title}</h2>

      {data.length === 0 || total === 0 ? (
        <p className="admin-chart-empty">Aucune donnée disponible.</p>
      ) : (
        <div className="admin-pie-layout">
          <div className="admin-pie" style={{ background }} />

          <div className="admin-pie-legend">
            {data.map((item, index) => (
              <div className="admin-pie-row" key={item.label}>
                <span
                  className="admin-pie-dot"
                  style={{ background: `var(--chart-${(index % 5) + 1})` }}
                />
                <span>{item.label}</span>
                <strong>{formatPrice(item.totalCents)}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryPieChart;