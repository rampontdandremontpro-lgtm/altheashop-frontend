import common from "./common";
import home from "./home";
import cart from "./cart";
import checkout from "./checkout";
import orders from "./orders";
import product from "./product";
import contact from "./contact";
import auth from "./auth";
import account from "./account";

const he = {
  ...common,
  ...cart,
  ...checkout,
  ...orders,
  ...product,
  ...contact,
  ...home,
  ...auth,
  ...account,
};

export default he;