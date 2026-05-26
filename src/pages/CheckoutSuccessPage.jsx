import { Link, useSearchParams } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();

  const reference = searchParams.get("reference");
  const total = Number(searchParams.get("total") || 0);

  return (
    <div className="page-stack">
      <section className="section">
        <div className="box success-page">
          <h1>Commande confirmée</h1>

          <p>
            Merci pour votre achat sur <strong>Althea Shop</strong>.
          </p>

          {reference && (
            <p>
              Référence de commande : <strong>{reference}</strong>
            </p>
          )}

          {total > 0 && (
            <p>
              Total payé : <strong>{formatPrice(total)}</strong>
            </p>
          )}

          <p>
            Vous pouvez retrouver le détail de votre commande et télécharger la
            facture depuis votre espace client.
          </p>

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