import { Link } from "react-router-dom";

function CategoryCard({ category }) {
  return (
    <Link to={`/categories/${category.slug}`} className="card">
      <div className="card-image-wrapper">
        <img
          src={category.imageUrl || "https://placehold.co/600x400?text=Categorie"}
          alt={category.name}
          className="card-image"
        />
      </div>

      <div className="card-body">
        <h3>{category.name}</h3>
        <p>{category.description || "Découvrir cette catégorie"}</p>
      </div>
    </Link>
  );
}

export default CategoryCard;