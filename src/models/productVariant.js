const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productVariantSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sellPrice: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    options: [
      {
        optionType: {
          type: Schema.Types.ObjectId,
          ref: "ProductOption"
        },
        name: {
          type: String,
          required: true
        }
      }
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    // images: [
    //   {
    //     type: String,
    //     default: defaultImage,
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);
module.exports = ProductVariant;
