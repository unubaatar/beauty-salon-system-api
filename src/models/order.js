const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const states = ["pending", "in_process", "arrived", "complete"];

const orderType = ["delivery", "arrival"];

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "CartItem",
      },
    ],
    orderNumber: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      default: "pending",
      enum: states,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    orderType: {
      type: String,
      enum: orderType,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
