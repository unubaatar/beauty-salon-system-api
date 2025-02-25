const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceVariant = new Schema(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
  },
  {
    timestamps: true,
  }
);

const ServiceVariant = mongoose.model("ServiceVariant", serviceVariant);
module.exports = ServiceVariant;
