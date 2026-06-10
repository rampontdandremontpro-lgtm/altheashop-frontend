const checkout = {
  checkoutTitle: "Checkout",
  connectedWith: "Logged in as",
  loadingCheckout: "Loading checkout...",
  loginRequired: "Login Required",
  loginRequiredMessage:
    "You must be logged in to complete your order.",
  loginAction: "Log In",
  stripeMissingKey:
    "Missing Stripe public key in .env file: VITE_STRIPE_PUBLIC_KEY.",
  loadAddressesError: "Unable to load addresses.",
  selectShippingAddressError:
    "Please select a shipping address.",
  stripeNotReady: "Stripe is not ready yet.",
  cardRequired: "Please enter card information.",
  paymentDeclined: "Payment declined.",
  paymentNotValidated: "Payment could not be validated.",
  orderConfirmError: "Unable to confirm the order.",
  shippingAddressStep: "1. Shipping Address",
  noAddress: "No address saved.",
  addAddress: "Add Address",
  selectedAddress: "Selected Address",
  securePaymentStep: "2. Secure Payment",
  stripeHelp:
    "Payment is processed by Stripe. Banking information is not stored on this website.",
  validationStep: "3. Confirmation",
  paymentLoading: "Processing payment...",
  pay: "Pay",
  orderSummary: "Order Summary",

  checkoutSuccessTitle: "Your order has been successfully placed",
  checkoutSuccessThanks: "Thank you for shopping at",
  checkoutSuccessMessage:
    "Your order has been confirmed and will be processed shortly by our team.",
  totalPaid: "Total Paid",
  checkoutSuccessInfo:
    "You can view your order details and download the invoice from your account.",
  viewMyOrders: "View My Orders",
  backToCatalog: "Back to Catalog",
};

export default checkout;