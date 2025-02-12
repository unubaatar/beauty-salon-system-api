const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const timeRequestSchema = new Schema(
  {
    schedule: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    day: {
      type: String,
    },
    hasReserved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const TimeRequest = mongoose.model("TimeRequest", timeRequestSchema);
module.exports = TimeRequest;
