const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    body: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    workers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "ServiceCategory",
    },
    variants: [
      {
        type: Schema.Types.ObjectId,
        ref: "ServiceVariant",
      },
    ],
    hasAdditionalPrice: {
      type: Boolean,
      default: false
    },
    additionalPrices: [
      {
        workerLevel: {
          type: Schema.Types.ObjectId,
          ref: "WorkerLevel",
        },
        additionalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
