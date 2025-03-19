const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productOptionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


const ProductOption = mongoose.model(
  "ProductOption",
  productOptionSchema
);
module.exports = ProductOption;