import express from "express";

const productRouter = express.Router();

import {
  editProduct,
  getAllProducts,
  getProductLikes,
  getOneProduct,
  getRelatedProducts,
  postProduct,
  removeProduct,
  searchProductByTitle,

} from "./product.controller.js";
// import { validate, validateproductData } from "./product.validation.js";
import { protect } from "../../middleware/auth2.js";

productRouter.post("/create", postProduct);
productRouter.get("/fetch-all", getAllProducts);
productRouter.get("/fetch-one/:id", getOneProduct);
productRouter.put("/edit/:product", protect, editProduct);
productRouter.delete("/remove/:id", protect, removeProduct);
productRouter.get("/search", searchProductByTitle)
productRouter.post("/related-products", getRelatedProducts);
productRouter.patch("/like/:id", protect, getProductLikes);


export default productRouter;

