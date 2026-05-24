function formatPrice(cents) {
  return `${(Number(cents || 0) / 100).toLocaleString("fr-FR")} €`;
}

function SalesChart({ title, data = [] }) {
  const maxValue = Math.max(...data.map((item) => item.totalCents || 0), 1);

  return (
    <div className="box admin-chart-card">
      <h2>{title}</h2>

      {data.length === 0 ? (
        <p className="admin-chart-empty">Aucune donnée disponible.</p>
      ) : (
        <div className="admin-bar-chart">
          {data.map((item) => {
            const height = Math.max(
              8,
              Math.round(((item.totalCents || 0) / maxValue) * 160)
            );

            return (
              <div className="admin-bar-item" key={item.label}>
                <div className="admin-bar-value">
                  {formatPrice(item.totalCents)}
                </div>

                <div className="admin-bar-track">
                  <div
                    className="admin-bar"
                    style={{ height: `${height}px` }}
                  />
                </div>

                <div className="admin-bar-label">{item.label}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SalesChart;