const express = require("express");

const productRouter = express.Router();

const { catchErrors } = require("../../library/helpers/errorFormatHelpers");

const { getAuthorize } = require("../../library/middlewares/authMiddleware");

const productController = require("./product.controllers");
const { validateproduct } = require("./product.validator");

productRouter.post(
  "/create",
  getAuthorize,
  catchErrors(productController.createProduct)
);
productRouter.get(
  "/fetch-product",
  catchErrors(productController.getMyProducts)
);
productRouter.get(
  "/fetch-all",
  catchErrors(productController.getAllProductByAdmin)
);
productRouter.put(
  "/edit/:productId",
  getAuthorize,
  catchErrors(productController.updateProduct)
);
productRouter.delete(
  "/remove/:productId",
  getAuthorize,
  catchErrors(productController.deleteProduct)
);
productRouter.get(
  "/fetch-one/:id",
  catchErrors(productController.getSingleProduct)
);

module.exports = productRouter;
