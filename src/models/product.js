const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const defaultImage =
  "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg";


const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            default: defaultImage,
        }
    ],
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    sellPrice: {
        type: Number,
    },
    isActive: {
        type: Boolean,
        default: true
    }
} , {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;