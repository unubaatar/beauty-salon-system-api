const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.create = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    if (!firstName || !lastName || !phone || !email || !password) {
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

exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Insert all fields" });
    }

    const foundUser = await User.findOne({ phone: phone });
    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await foundUser.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password not match" });
    }

    const token = foundUser.getJsonWebToken();

    const bearerToken = jwt.sign(
      { id: foundUser._id },
      process.env.BEARER_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ user: foundUser, token, bearerToken });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id, ...body } = req.body;
    const user = await User.findByIdAndUpdate(_id, body);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { per_page = 10, page = 1, filter } = req.body;
    let query = {};
    if (filter && filter.role) {
      query.role = filter.role;
    }
    const count = await User.countDocuments(query);
    const users = await User.find(query)
      .populate("level")
      .skip((page - 1) * per_page)
      .limit(per_page);
    return res.status(200).json({ count: count, rows: users });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.all = async (req, res, next) => {
  try {
    const count = await User.countDocuments({});
    const users = await User.find({}).populate("level");
    return res.status(200).json({ count: count, rows: users });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getWorkers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "worker" });
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.checkToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(202).send("Token is missing");
    }
    const decoded = jwt.decode(token);
    if (!decoded) {
      return res.status(401).send("Invalid token");
    }
    const expirationTime = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    if (expirationTime < currentTime) {
      return res.status(200).json({ valid: false });
    }
    return res.status(200).json({ valid: true });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const foundUser = await User.findById(_id).select(
      "firstName lastName avatar role"
    );
    if (!foundUser) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(foundUser);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
