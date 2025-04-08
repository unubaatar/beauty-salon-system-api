const Customer = require("../models/customer");
const jwt = require("jsonwebtoken");

exports.create = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email, password  , avatar } = req.body;

    if (!firstName || !lastName || !phone || !email || !password) {
      return res.status(400).json({ message: "Insert all fields" });
    }

    const foundCustomerByPhone = await Customer.findOne({ phone: phone });
    if (foundCustomerByPhone) {
      return res.status(400).json({ message: "Phone is already registered" });
    }

    const foundCustomerByEmail = await Customer.findOne({ email: email });
    if (foundCustomerByEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const newCustomer = new Customer(req.body);
    await newCustomer.save();

    return res.status(201).json({ message: "Customer created successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Insert all fields" });
    }

    const foundCustomer = await Customer.findOne({ phone: phone });
    if (!foundCustomer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    const isMatch = await foundCustomer.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password not match" });
    }
    const token = foundCustomer.getJsonWebToken();
    return res
      .status(200)
      .json({
        customer: foundCustomer._id.toString(),
        token,
        name: foundCustomer.firstName,
        avatar: foundCustomer.avatar,
      });
  } catch (err) {
    next(err);
  }
};


exports.getById = async(req  , res , next) => {
  try {
    const { _id } = req.body;
    const customer = await Customer.findById(_id).select("-password");
    if(!customer) {
      return res.status(400).json({ message: "User not found" });
    }  
    return res.status(200).json(customer);
  } catch(err) {
    next(err);
  }
}