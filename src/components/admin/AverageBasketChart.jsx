function formatPrice(cents) {
  return `${(Number(cents || 0) / 100).toLocaleString("fr-FR")} €`;
}

function AverageBasketChart({ title, data = [] }) {
  const averageData = data
    .filter((item) => Number(item.ordersCount || 0) > 0)
    .map((item) => ({
      label: item.label,
      averageCents: Math.round(
        Number(item.totalCents || 0) / Number(item.ordersCount || 1)
      ),
      ordersCount: Number(item.ordersCount || 0),
    }));

  const maxValue = Math.max(
    ...averageData.map((item) => item.averageCents || 0),
    1
  );

  return (
    <div className="box admin-chart-card">
      <h2>{title}</h2>

      {averageData.length === 0 ? (
        <p className="admin-chart-empty">
          Données panier moyen non disponibles.
        </p>
      ) : (
        <div className="admin-horizontal-chart">
          {averageData.map((item) => {
            const width = Math.max(
              8,
              Math.round((item.averageCents / maxValue) * 100)
            );

            return (
              <div className="admin-horizontal-row" key={item.label}>
                <div className="admin-horizontal-label">
                  <strong>{item.label}</strong>
                  <span>{item.ordersCount} commande(s)</span>
                </div>

                <div className="admin-horizontal-track">
                  <div
                    className="admin-horizontal-bar"
                    style={{ width: `${width}%` }}
                  />
                </div>

                <strong>{formatPrice(item.averageCents)}</strong>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AverageBasketChart;