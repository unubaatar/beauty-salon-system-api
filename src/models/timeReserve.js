const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeReserveStates = require("../constants/timeReserveStates");
const timeReservePaymentStates = require("../constants/timeReservePaymentStates");

const timeReserveSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    services: [
      {
        service: {
          type: Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        variant: {
          type: Schema.Types.ObjectId,
          ref: "ServiceVariant",
        },
        price: {
          type: Number,
          required: true
        }
      },
    ],
    schedule: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    dateTitle: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    totalDuration: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      enum: timeReserveStates,
      default: "in process",
    },
    paymentState: {
      type: String,
      enum: timeReservePaymentStates,
      default: "pending",
    },
    timeReserveNumber: {
      type: String,
      required: true
    },
    additionalPrices: [
      {
        service: {
          type: Schema.Types.ObjectId,
          ref: "Service",
        },
        price: {
          type: Number,
        } 
      }
    ]
  },
  {
    timestamps: true,
  }
);

const TimeReserve = mongoose.model("TimeReserve", timeReserveSchema);
module.exports = TimeReserve;
