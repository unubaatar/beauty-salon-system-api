const Order = require("../models/order");
const CartItem = require("../models/cartItem");
const OrderItem = require("../models/orderItem");

exports.create = async (req, res, next) => {
  try {
    const { customer, items, address, orderType } = req.body;
    if (!customer || !items || !address || !orderType) {
      return res.status(400).json({ message: "Insert all fields" });
    }

    const now = new Date();

    const year = now.getFullYear() % 100;
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    let totalPrice = 0;
    let orderItems = [];

    await Promise.all(
      items.map(async (item) => {
        const foundItem = await CartItem.findById(item);
        if (foundItem.sellPrice) {
          totalPrice += foundItem.sellPrice * foundItem.qty;
        } else {
          totalPrice += foundItem.price * foundItem.qty;
        }

        let orderItemData = {
          customer: foundItem.customer,
          product: foundItem.product,
          qty: foundItem.qty,
          totalPrice: foundItem.totalPrice,
          price: foundItem.price,
        };

        if (foundItem.variant) {
          orderItemData.variant = foundItem.variant;
        }

        if (foundItem.sellPrice) {
          orderItemData.sellPrice = foundItem.sellPrice;
        }
        const newOrderItem = new OrderItem(orderItemData);
        await newOrderItem.save();
        orderItems.push(newOrderItem._id);
      })
    );

    const orderNumber = `BP${year}${month}${day}${hours}${minutes}`;
    const newOrder = new Order({
      customer: customer,
      items: orderItems,
      totalAmount: totalPrice,
      orderNumber: orderNumber,
      address: address,
      orderType: orderType,
    });
    await newOrder.save();
    const cartItems = await CartItem.find({ customer: customer });
    await Promise.all(
      cartItems.map(async (item) => {
        await CartItem.findByIdAndDelete(item._id);
      })
    );

    return res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { _id } = req.body;

    const foundOrder = await Order.findById(_id)
      .populate("customer")
      .populate({
        path: "items",
        populate: [
          { path: "variant" },
          { path: "product", populate: { path: "category variants" } },
          { path: "customer" },
        ],
      });

    if (!foundOrder) {
      return res.status(400).json({ message: "Not found" });
    }

    return res.status(200).json(foundOrder);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    console.log("create");
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { page = 1, per_page = 10, filter } = req.body;
    let query = {};
    const orders = await Order.find(query)
      .populate({
        path: "customer",
        select: "firstName lastName phone email avatar",
      })
      .populate({
        path: "items",
        populate: [
          { path: "variant" },
          { path: "product", populate: { path: "category variants" } },
        ],
      })
      .skip((page - 1) * per_page)
      .limit(per_page)
      .sort({ createdAt: -1 });
    const count = await Order.countDocuments({});
    return res.status(200).json({ count: count, rows: orders });
  } catch (err) {
    next(err);
  }
};

exports.getByCustomer = async (req, res, next) => {
  try {
    const { customer } = req.body;
    const foundOrders = await Order.find({ customer: customer })
      .populate("customer")
      .populate({
        path: "items",
        populate: [
          { path: "variant" },
          { path: "product", populate: { path: "category variants" } },
          { path: "customer" },
        ],
      });
    const count = await Order.countDocuments({ customer: customer });
    return res.status(200).json({ count: count, rows: foundOrders });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const foundOrder = await Order.findByIdAndUpdate(_id, req.body);
    if (!foundOrder) {
      return res.status(400).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "Successful" });
  } catch (err) {
    next(err);
  }
};

exports.getProductReport = async (req, res, next) => {
  try {
    const { dateFilter } = req.body;

    const date1 = new Date(dateFilter[0]);
    const date2 = new Date(dateFilter[1]);

    const [fromDate, toDate] =
      date1.getTime() <= date2.getTime()
        ? [dateFilter[0], dateFilter[1]]
        : [dateFilter[1], dateFilter[0]];

    const foundOrders = await OrderItem.find({
      createdAt: { $gte: fromDate, $lte: toDate },
    }).populate({
      path: "product",
      select: "name images",
    });

    let data = [];

    foundOrders.forEach((orderItem) => {
      const existingItem = data.find(item => 
        item.product._id.toString() === orderItem.product._id.toString()
      );
      if (!existingItem) {
        data.push({
          product: orderItem.product,
          qty: orderItem.qty,
          totalPrice: orderItem.totalPrice,
        });
      } else {
        existingItem.qty += orderItem.qty;
        existingItem.totalPrice += orderItem.totalPrice;
      }
    });
    data.sort((item1, item2 ) => item2.qty - item1.qty);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
