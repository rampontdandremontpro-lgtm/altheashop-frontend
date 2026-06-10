import common from "./common";
import cart from "./cart";
import checkout from "./checkout";
import orders from "./orders";
import product from "./product";
import contact from "./contact";

const he = {
  ...common,
  ...cart,
  ...checkout,
  ...orders,
  ...product,
  ...contact,
};

export default he;