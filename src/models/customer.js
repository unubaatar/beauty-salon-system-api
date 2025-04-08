  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");

  const defaultAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDXHyqEEcIEQzggUF5RIBe8g37M9n1guqKhg&s";

  const customerSchema = new Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        default: defaultAvatar
      }
    },
    {
      timestamps: true,
    }
  );

  customerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });

  customerSchema.methods.getJsonWebToken = function() {
    const token = jwt.sign({ id: this._id } , process.env.SECRET_KEY ,  { expiresIn: '1h' });
    return token;
  };

  customerSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  const Customer = mongoose.model("Customer" , customerSchema);
  module.exports = Customer;
