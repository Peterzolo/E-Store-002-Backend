import userRoutes from "./user/user.route.js";
import productRoutes from "./product/product.routes.js"
import orderRoutes from "./order/order.routes.js"


 export const componentModule = {  
  userModule: {
    routes: userRoutes,      
  },
  productModule: {
    routes: productRoutes,
  },
  orderModule: {
    routes: orderRoutes,
  },
};


