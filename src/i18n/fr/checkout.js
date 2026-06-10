const checkout = {
  checkoutTitle: "Commande",
  connectedWith: "Connecté avec",
  loadingCheckout: "Chargement du checkout...",
  loginRequired: "Connexion requise",
  loginRequiredMessage: "Vous devez être connecté pour finaliser votre commande.",
  loginAction: "Se connecter",
  stripeMissingKey:
    "Clé publique Stripe manquante dans le fichier .env : VITE_STRIPE_PUBLIC_KEY.",
  loadAddressesError: "Impossible de charger les adresses.",
  selectShippingAddressError: "Merci de sélectionner une adresse de livraison.",
  stripeNotReady: "Stripe n'est pas encore prêt.",
  cardRequired: "Merci de renseigner les informations de carte.",
  paymentDeclined: "Paiement refusé.",
  paymentNotValidated: "Le paiement n'a pas pu être validé.",
  orderConfirmError: "Impossible de confirmer la commande.",
  shippingAddressStep: "1. Adresse de livraison",
  noAddress: "Aucune adresse enregistrée.",
  addAddress: "Ajouter une adresse",
  selectedAddress: "Adresse sélectionnée",
  securePaymentStep: "2. Paiement sécurisé",
  stripeHelp:
    "Le paiement est traité par Stripe. Les informations bancaires ne sont pas stockées dans le site.",
  validationStep: "3. Validation",
  paymentLoading: "Paiement en cours...",
  pay: "Payer",
  orderSummary: "Résumé commande",

  checkoutSuccessTitle: "Votre commande a bien été enregistrée",
  checkoutSuccessThanks: "Merci pour votre achat sur",
  checkoutSuccessMessage:
    "Votre commande a été confirmée et sera traitée prochainement par notre équipe.",
  totalPaid: "Total payé",
  checkoutSuccessInfo:
    "Vous pouvez retrouver le détail de votre commande et télécharger la facture depuis votre espace client.",
  viewMyOrders: "Voir mes commandes",
  backToCatalog: "Retour au catalogue",
};

export default checkout;