const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workerLevelSchema = new Schema(
  {
    level: {
        type: String,
        required: true
    },
    image: {
        type: String,
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

const WorkerLevel = mongoose.model("WorkerLevel", workerLevelSchema);
module.exports = WorkerLevel;
