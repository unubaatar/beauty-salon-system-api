const Customer = require("../models/customer");

exports.create = async (req, res, next) => {
    try {
      const { firstName, lastName, phone, email, password } = req.body;
  
      if (!firstName || !lastName || !phone || !email  || !password) {
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

  exports.login = async(req , res , next) => {
    try {
      const { phone , password } = req.body;
  
      if(!phone || !password) {
        return res.status(400).json({ message: "Insert all fields" });
      }
  
      const foundCustomer = await Customer.findOne({ phone: phone });
      if(!foundCustomer) {
        return res.status(400).json({ message: "Customer not found" });
      }
  
      const isMatch = await foundCustomer.comparePassword(password);
      if(!isMatch) {
        return res.status(400).json({ message: "Password not match" });
      }
      return res.status(200).json({ customer: foundCustomer._id.toString() });
    } catch(err) {
      next(err);
    }
  }
  