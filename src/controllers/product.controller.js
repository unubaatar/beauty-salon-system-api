const Product = require("../models/product");

exports.create = async (req, res, next) => {
  try {
    const { name, description, images, price, stock } = req.body;
    if (images.length === 0) {
      return res.status(400).json({ message: "Insert all fields" });
    }
    if (!name || !description || !images || !price || !stock) {
      return res.status(400).json({ message: "Insert all fields" });
    }
    const product = new Product(req.body);
    await product.save();
    return res.status(201).json(product);
  } catch (err) {
    console.log(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { filter, page = 1, per_page = 10 } = req.body;
    const products = await Product.find({})
      .populate("category variants")
      .populate({
        path: "variants",
      })
      .skip((page - 1) * per_page)
      .limit(per_page)
      .sort({ createdAt: -1 });
    const count = await Product.countDocuments({});
    return res.status(200).json({ count: count, rows: products });
  } catch (err) {
    console.log(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const foundProduct = await Product.findByIdAndUpdate(_id, req.body);
    if (!foundProduct) {
      return res.status(400).json({ message: "Not found" });
    }
    return res.status(200).json(foundProduct);
  } catch (err) {
    console.log(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const foundProduct = await Product.findById(_id)
      .populate("category variants")
      .populate({
        path: "variants",
      });
    if (!foundProduct) {
      return res.status(400).json({ message: "Product not found" });
    }
    return res.status(200).json(foundProduct);
  } catch (err) {
    console.log(err);
  }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const { category } = req.body;
    const products = await Product.find({ category: category })
      .populate("category variants")
      .populate({
        path: "variants",
      });
    const count = await Product.countDocuments({ category: category });
    return res.status(200).json({ count: count, rows: products });
  } catch (err) {
    console.log(err);
  }
};

exports.getLatest = async (req, res, next) => {
  try {
    const services = await Product.find({})
      .populate("category variants")
      .populate({
        path: "variants",
      })
      .sort({ createdAt: -1 })
      .limit(4);
    return res.status(200).json(services);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
