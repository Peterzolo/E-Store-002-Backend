const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    product: [
      {
        productId: {
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
    amount: {   
      type: Number,
      required: true,
    },

    location: {
      address: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["pending", "progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("order", OrderSchema);
module.exports = Order;
