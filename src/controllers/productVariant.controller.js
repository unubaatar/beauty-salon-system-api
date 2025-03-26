const ProductVariant = require("../models/productVariant");
const Product = require("../models/product");

exports.create = async(req , res , next) => {
    try {
        const { productId , variant } = req.body;
        if(!productId || !variant ) {
            return res.status(400).json({ message: "Insert all fields" });
        }
        if(!variant.price || !variant.title ) {
            return res.status(400).json({ message: "Insert all fields" });
        }
        const foundProduct = await Product.findById(productId);

        if(!foundProduct) {
            return res.status(400).json({ message: "Not found" });
        }
        const newVariant = new ProductVariant(variant);
        await newVariant.save();
        foundProduct.variants.push(newVariant);
        await foundProduct.save();
        return res.status(201).json(newVariant);
    } catch(err) {
        console.log(err);
    }
}

exports.update = async(req , res , next) => {
    try {
        const { _id, ...body } = req.body;
        const foundVariant = await ProductVariant.findByIdAndUpdate(_id , body);
        if(!foundVariant) {
            return res.status(404).json({ message: "Not found" });
        };
        return res.status(200).json(foundVariant);
    } catch(err) {
        console.log(err);
    }
}

