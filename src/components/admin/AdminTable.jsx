import { useMemo, useState } from "react";

function AdminTable({
  columns = [],
  data = [],
  actions,
  emptyMessage = "Aucune donnée disponible.",
}) {
  const [sortConfig, setSortConfig] = useState(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      }

      return aValue < bValue ? 1 : -1;
    });
  }, [data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: "asc" };
      }

      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }

      return null;
    });
  };

  if (data.length === 0) {
    return <div className="box">{emptyMessage}</div>;
  }

  return (
    <div className="box table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                <button
                  type="button"
                  className="admin-sort-button"
                  onClick={() => handleSort(column.key)}
                >
                  {column.label}
                  {sortConfig?.key === column.key &&
                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </button>
              </th>
            ))}

            {actions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={`${row.id}-${column.key}`}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}

              {actions && <td>{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;