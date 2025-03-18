const ProductCategory = require("../models/productCategory");

exports.create = async(req , res , next ) => {
    try {
        const { title , image } = req.body;
        if(!title || !image) {
            return res.status(400).json({ message: "Insert all fields" });
        }
        const category = new ProductCategory(req.body);
        await category.save();
        return res.status(201).json(category);
    } catch(err) {
        console.log(err);
    }
}

exports.list = async(req , res , next ) => {
    try {
        console.log("list");
    } catch(err) {
        console.log(err);
    }
}

exports.all = async(req , res , next ) => {
    try {
        const rows = await ProductCategory.find({});
        const count = await ProductCategory.countDocuments({});

        return res.status(200).json({ count: count , rows: rows });
    } catch(err) {
        console.log(err);
    }
}


exports.update = async(req , res , next ) => {
    try {
        const { _id } = req.body;
        const foundCategory = await ProductCategory.findByIdAndUpdate(_id , req.body);
        if(!foundCategory) {
            return res.status(400).json({ message: "Not found" });
        }
        return res.status(200).json(foundCategory);
    } catch(err) {
        console.log(err);
    }
}

exports.getById = async(req , res , next ) => {
    try {
        console.log("getById");
    } catch(err) {
        console.log(err);
    }
}