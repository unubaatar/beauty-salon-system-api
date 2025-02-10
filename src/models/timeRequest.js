const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeRequestSchema = new Schema(
  {
    time: {
      type: String,
      required: true
    },
    schedule: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
    price: {
      type: Number,
    },
    discount: {
        type: Number
    },
    paidDate: {
        type: Date,
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
    },
    hasOrdered: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const TimeRequest = mongoose.model("TimeRequest" , timeRequestSchema);
module.exports = TimeRequest;
