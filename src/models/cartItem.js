const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
    qty: {
      type: Number,
      default: 1,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sellPrice: {
      type: Number,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CartItem = mongoose.model("CartItem", cartItemSchema);
module.exports = CartItem;
