const CartItem = require("../models/cartItem");
const Product = require("../models/product");

exports.create = async (req, res, next) => {
  try {
    const { product, customer, variant, qty, sellPrice, price } = req.body;
    if (!product || !customer || !price) {
      return res.status(400).json({ message: "Insert all fields" });
    }
    let totalPrice;
    if (!sellPrice && sellPrice == null) {
      totalPrice = price * qty;
    } else {
      totalPrice = sellPrice * qty;
    }
    const newCartItem = new CartItem(req.body);
    newCartItem.totalPrice = totalPrice;
    await newCartItem.save();
    return res.status(201).json(newCartItem);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id, qty } = req.body;
    const cartItem = await CartItem.findById(_id);

    if (!cartItem) {
      return res.status(400).json({ message: "Not found" });
    }
    cartItem.qty = qty;
    await cartItem.save();

    if (cartItem.sellPrice) {
      cartItem.totalPrice = cartItem.qty * cartItem.sellPrice;
    } else {
      cartItem.totalPrice = cartItem.qty * cartItem.price;
    }
    await cartItem.save();
    return res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getByCustomer = async (req, res, next) => {
  try {
    const { customer } = req.body;
    const cartItems = await CartItem.find({ customer: customer })
      .populate({
        path: "customer variant product",
      })
      .populate({
        path: "product",
        populate: "variants category",
      });
    const count = await CartItem.countDocuments({ customer: customer });
    return res.status(200).json({ count: count, rows: cartItems });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const deletedCartItem = await CartItem.findByIdAndDelete(_id);
    if (!deletedCartItem) {
      return res.status(400).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};
