const User = require("../models/user");

exports.create = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    if (!firstName || !lastName || !phone || !email  || !password) {
      return res.status(400).json({ message: "Insert all fields" });
    }

    const foundUserByPhone = await User.findOne({ phone: phone });
    if (foundUserByPhone) {
      return res.status(400).json({ message: "Phone is already registered" });
    }

    const foundUserByEmail = await User.findOne({ email: email });
    if (foundUserByEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const newUser = new User(req.body);
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
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

    const foundUser = await User.findOne({ phone: phone });
    if(!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await foundUser.comparePassword(password);
    if(!isMatch) {
      return res.status(400).json({ message: "Password not match" });
    }
    return res.status(200).json({ user: foundUser._id.toString() });
  } catch(err) {
    next(err);
  }
}
