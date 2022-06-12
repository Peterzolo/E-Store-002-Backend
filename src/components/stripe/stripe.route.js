const express = require("express");

const stripeRouter = express.Router();

const { stripePayment } = require("./stripe.controller");

stripeRouter.post("payment", stripePayment);

module.exports = stripeRouter;
