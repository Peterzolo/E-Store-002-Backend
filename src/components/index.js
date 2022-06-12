const userRoutes = require("./user/user.routes");
const categoryRoute = require("./category/category.routes");
const productRoute = require("./product/product.routes");
const orderRoute = require("./order/order.routes");
const cartRoute = require("./cart/cart.routes");
const singleFileRoute = require("./fileUpload/fileUpload.routes")
const stripeRoute = require('./stripe/stripe.route')
const componentModule = {
  userModule: {
    routes: userRoutes,    
  },
  categoryModule: {
    routes: categoryRoute,
  },
  productModule: {
    routes: productRoute,
  },
  orderModule: {
    routes: orderRoute,
  },
  cartModule: {
    routes: cartRoute,
  },
  singleFileModule: {
    routes: singleFileRoute,
  },
  stripeModule: {
    routes: stripeRoute,
  },
};

module.exports = componentModule;
