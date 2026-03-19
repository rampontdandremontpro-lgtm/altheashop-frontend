function EmptyState({
  title = "Aucun résultat",
  message = "Aucun élément à afficher pour le moment.",
}) {
  return (
    <div className="box empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;