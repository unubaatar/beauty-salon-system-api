const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const ServiceCategory = mongoose.model(
  "ServiceCategory",
  serviceCategorySchema
);
module.exports = ServiceCategory;
