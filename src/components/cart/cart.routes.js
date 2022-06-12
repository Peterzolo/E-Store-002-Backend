const express = require("express");

const cartRouter = express.Router();

const { catchErrors } = require("../../library/helpers/errorFormatHelpers");

const { getAuthorize } = require("../../library/middlewares/authMiddleware");

const cartController = require("./cart.controllers");
const { validatecart } = require("./cart.validator");

cartRouter.post(
  "/create",

  catchErrors(cartController.createCart)
);
cartRouter.get(
  "/fetch-cart",
  // getAuthorize,
  catchErrors(cartController.getMyCarts)
);
cartRouter.get(
  "/fetch-all",

  catchErrors(cartController.getAllCartsByAdmin)
);
cartRouter.put(
  "/edit/:cartId",

  catchErrors(cartController.updateCart)
);
cartRouter.delete(
  "/remove/:cartId",
getAuthorize,
  catchErrors(cartController.deleteCart)
);
cartRouter.get(
  "/fetch-one/:id",
getAuthorize,
  catchErrors(cartController.getSingleCart)
);
cartRouter.get(
  "/fetch/:id",
getAuthorize,
  catchErrors(cartController.getUserCart)
);

module.exports = cartRouter;
