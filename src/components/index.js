import userRoutes from "./user/user.route.js";
import productRoutes from "./product/product.routes.js"


 export const componentModule = {  
  userModule: {
    routes: userRoutes,   
  },
  productModule: {
    routes: productRoutes,
  },
};

// export default componentModule;
