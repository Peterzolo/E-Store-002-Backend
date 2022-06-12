const express = require("express");

const orderRouter = express.Router();

const { catchErrors } = require("../../library/helpers/errorFormatHelpers");

const { getAuthorize } = require("../../library/middlewares/authMiddleware");

const orderController = require("./order.controllers");
const { validateorder } = require("./order.validator");

orderRouter.post(
  "/create",
  getAuthorize,
  catchErrors(orderController.createOrder)
);

orderRouter.get(
  "/fetch-all",
  getAuthorize,
  catchErrors(orderController.getAllOrdersByAdmin)
);
orderRouter.put(
  "/edit/:orderId",
  getAuthorize,
  catchErrors(orderController.updateOrder)
);
orderRouter.delete(
  "/remove/:orderId",
  getAuthorize,
  catchErrors(orderController.deleteOrder)
);
orderRouter.get(
  "/fetch-one/:id",
  getAuthorize,
  catchErrors(orderController.getSingleOrder)
);

module.exports = orderRouter;
