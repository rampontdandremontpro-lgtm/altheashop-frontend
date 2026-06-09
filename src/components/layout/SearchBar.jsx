import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";

function SearchBar({ onSearchDone }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const isSearchPage = location.pathname === "/search";

    if (isSearchPage) {
      const params = new URLSearchParams(location.search);
      setQuery(params.get("q") || "");
    } else {
      setQuery("");
    }
  }, [location.pathname, location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      navigate("/search");
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }

    if (onSearchDone) {
      onSearchDone();
    }
  };

  return (
    <form className="header-search" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label={t("searchAria")}
      />

      <button type="submit" className="btn btn-primary">
        {t("searchButton")}
      </button>
    </form>
  );
}

export default SearchBar;