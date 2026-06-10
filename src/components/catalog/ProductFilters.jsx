import { useI18n } from "../../context/I18nContext";

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
  const { t } = useI18n();

  return (
    <form className="filters" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="relevance">{t("sortRelevance")}</option>
        <option value="priority">{t("sortPriority")}</option>
        <option value="price_asc">{t("sortPriceAsc")}</option>
        <option value="price_desc">{t("sortPriceDesc")}</option>
        <option value="name_asc">{t("sortNameAsc")}</option>
        <option value="name_desc">{t("sortNameDesc")}</option>
      </select>

      <label className="checkbox-inline">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
        />
        {t("inStock")}
      </label>

      <button type="submit" className="btn btn-primary">
        {t("filter")}
      </button>

      <button type="button" className="btn btn-secondary" onClick={onReset}>
        {t("resetFilters")}
      </button>
    </form>
  );
}

export default ProductFilters;