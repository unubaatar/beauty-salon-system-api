const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeRequestStates = require("../constants/timeRequestStates");
const timeRequestPaymentStates = require("../constants/timeRequestPaymentStates");

const timeRequestSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    schedule: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
    time: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    state: {
      type: String,
      enum: timeRequestStates,
      default: "free",
    },
    paymentState: {
      type: String,
      enum: timeRequestPaymentStates,
      default: "pending",
    },
    paidDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const TimeRequest = mongoose.model("TimeRequest", timeRequestSchema);
module.exports = TimeRequest;
