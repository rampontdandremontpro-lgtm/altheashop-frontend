function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="pagination">
      <button
        className="btn btn-secondary"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Précédent
      </button>

      <div className="pagination-pages">
        {pages.map((p) => (
          <button
            key={p}
            className={`page-btn ${p === page ? "active" : ""}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        className="btn btn-secondary"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Suivant
      </button>
    </div>
  );
}

export default Pagination;