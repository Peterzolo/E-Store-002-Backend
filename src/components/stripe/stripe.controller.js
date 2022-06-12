const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.stripePayment = (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "USD",
    },
    (error, result) => {
      if (error) {
        res.status(500).error;
      } else {
        res.status().send(result);
      }
    }
  );
};
