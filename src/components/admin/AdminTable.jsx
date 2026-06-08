import { useMemo, useState } from "react";

function AdminTable({
  columns = [],
  data = [],
  actions,
  emptyMessage = "Aucune donnée disponible.",
  selectable = false,
  selectedIds = [],
  onSelectionChange,
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

  const allVisibleIds = sortedData.map((row) => row.id);
  const allSelected =
    allVisibleIds.length > 0 &&
    allVisibleIds.every((id) => selectedIds.includes(id));

  const handleSort = (key, sortable = true) => {
    if (!sortable) return;

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

  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    if (allSelected) {
      onSelectionChange(
        selectedIds.filter((id) => !allVisibleIds.includes(id))
      );
      return;
    }

    onSelectionChange([...new Set([...selectedIds, ...allVisibleIds])]);
  };

  const handleSelectRow = (id) => {
    if (!onSelectionChange) return;

    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
      return;
    }

    onSelectionChange([...selectedIds, id]);
  };

  if (data.length === 0) {
    return <div className="box">{emptyMessage}</div>;
  }

  return (
    <div className="box table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {selectable && (
              <th className="admin-checkbox-cell">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Tout sélectionner"
                />
              </th>
            )}

            {columns.map((column) => (
              <th key={column.key}>
                {column.sortable === false ? (
                  column.label
                ) : (
                  <button
                    type="button"
                    className="admin-sort-button"
                    onClick={() => handleSort(column.key, column.sortable)}
                  >
                    {column.label}
                    {sortConfig?.key === column.key &&
                      (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                  </button>
                )}
              </th>
            ))}

            {actions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row) => (
            <tr key={row.id}>
              {selectable && (
                <td className="admin-checkbox-cell">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                    aria-label={`Sélectionner ${row.name || row.id}`}
                  />
                </td>
              )}

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