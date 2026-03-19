function ProductFilters({
  search,
  setSearch,
  sort,
  setSort,
  inStock,
  setInStock,
  onSubmit,
  onReset,
}) {
  return (
    <form className="filters" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="relevance">Pertinence</option>
        <option value="priority">Priorité</option>
        <option value="price_asc">Prix croissant</option>
        <option value="price_desc">Prix décroissant</option>
        <option value="name_asc">Nom A-Z</option>
        <option value="name_desc">Nom Z-A</option>
      </select>

      <label className="checkbox-inline">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
        />
        En stock
      </label>

      <button type="submit" className="btn btn-primary">
        Filtrer
      </button>

      <button type="button" className="btn btn-secondary" onClick={onReset}>
        Réinitialiser
      </button>
    </form>
  );
}

export default ProductFilters;