import { Link, useSearchParams } from "react-router-dom";

function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  return (
    <div className="page-stack">
      <section className="section">
        <div className="box success-page">
          <h1>Commande confirmée</h1>
          <p>Merci pour votre achat sur Althea Shop.</p>

          {reference && (
            <p>
              Référence de commande : <strong>{reference}</strong>
            </p>
          )}

          <div className="success-actions">
            <Link to="/orders" className="btn btn-primary">
              Voir mes commandes
            </Link>
            <Link to="/catalog" className="btn btn-secondary">
              Retour au catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CheckoutSuccessPage;