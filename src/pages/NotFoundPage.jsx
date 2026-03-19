import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="page-stack">
      <section className="section">
        <div className="box">
          <h1>404</h1>
          <p>Page introuvable.</p>
          <Link to="/" className="btn btn-primary">
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </div>
  );
}

export default NotFoundPage;