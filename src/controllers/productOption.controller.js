const ProductOption = require("../models/productOption");

exports.create = async (req, res, next) => {
  try {
    const productOption = new ProductOption(req.body);
    await productOption.save();
    return res.status(201).json(productOption);
  } catch (err) {
    console.log(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id, ...body } = req.body;
    const foundOption = await ProductOption.findByIdAndUpdate(_id, body);

    if (!foundOption) {
      return res.status(400).json({ message: "Insert all fields" });
    }
    return res.status(200).json(foundOption);
  } catch (err) {
    console.log(err);
  }
};

exports.all = async (req, res, next) => {
  try {
    const count = await ProductOption.countDocuments({});
    const all = await ProductOption.find({});
    return res.status(200).json({ count: count, rows: all });
  } catch (err) {
    console.log(err);
  }
};
