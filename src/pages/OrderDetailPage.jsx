import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { downloadOrderInvoice, getOrderById } from "../api/ordersApi";
import AccountSidebar from "../components/account/AccountSidebar";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatPrice } from "../utils/formatPrice";

function getOrderAddress(order) {
  return (
    order.shippingAddress ||
    order.address ||
    order.deliveryAddress ||
    order.billingAddress ||
    null
  );
}

function OrderDetailPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Impossible de charger la commande."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      await downloadOrderInvoice(order.id, order.reference);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de télécharger la facture."
      );
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Loader text="Chargement de la commande..." />;
  if (error && !order) return <ErrorMessage message={error} />;
  if (!order) return <ErrorMessage message="Commande introuvable." />;

  const address = getOrderAddress(order);

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Commande {order.reference}</h1>
            <p>
              Passée le{" "}
              {new Date(order.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>

          <Link to="/orders" className="btn btn-secondary">
            Retour commandes
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}

        <div className="account-layout">
          <AccountSidebar />

          <div className="orders-list">
            <div className="box order-card">
              <div className="order-card-head">
                <div>
                  <h2>{order.reference}</h2>
                  <p>Statut : {order.status}</p>
                </div>

                <strong>{formatPrice(order.totalPriceCents)}</strong>
              </div>

              <div className="detail-box">
                <h3>Adresse de livraison</h3>

                {address ? (
                  <p>
                    {address.addressLine1}
                    {address.addressLine2 ? `, ${address.addressLine2}` : ""},{" "}
                    {address.postalCode} {address.city},{" "}
                    {address.country}
                  </p>
                ) : (
                  <p>Adresse non disponible.</p>
                )}
              </div>

              <div className="detail-box">
                <h3>Paiement</h3>
                <p>{order.paymentMethod || "Non renseigné"}</p>
              </div>

              <div className="detail-box">
                <h3>Produits commandés</h3>

                <ul className="clean-list">
                  {(order.items || []).map((item) => (
                    <li key={item.id}>
                      {item.name} x {item.quantity} —{" "}
                      {formatPrice(item.priceCents * item.quantity)}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="account-card-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleDownloadInvoice}
                  disabled={downloading}
                >
                  {downloading
                    ? "Téléchargement..."
                    : "Télécharger la facture PDF"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrderDetailPage;