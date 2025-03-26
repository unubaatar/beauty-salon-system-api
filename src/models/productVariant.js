const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productVariantSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sellPrice: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);
module.exports = ProductVariant;
