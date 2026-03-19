export function formatPrice(cents) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format((cents || 0) / 100);
}