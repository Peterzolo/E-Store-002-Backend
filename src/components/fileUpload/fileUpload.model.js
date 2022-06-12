const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const singleFileSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SingleFile = mongoose.model("singleFile", singleFileSchema);

module.exports = SingleFile;
