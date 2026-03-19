function AdminStatsCard({ title, value, subtitle }) {
  return (
    <div className="box admin-stat-card">
      <p className="admin-stat-title">{title}</p>
      <h3>{value}</h3>
      {subtitle ? <p className="admin-stat-subtitle">{subtitle}</p> : null}
    </div>
  );
}

export default AdminStatsCard;