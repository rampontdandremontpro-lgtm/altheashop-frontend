import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SearchBar({ onSearchDone }) {
  const navigate = useNavigate();
  const location = useLocation();
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
        placeholder="Rechercher un produit..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Rechercher un produit"
      />
      <button type="submit" className="btn btn-primary">
        Rechercher
      </button>
    </form>
  );
}

export default SearchBar;