const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalAmount :{
      type : Number,
      required : true
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("cart", CartSchema);
module.exports = Cart;
