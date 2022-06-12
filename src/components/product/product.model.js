const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true,
      },
    ],
    brand: {
      type: String,
      default: "",
      required: true,
    },
    model: {
      type: String,
      required: true,
      default: "",
    },
    color: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
