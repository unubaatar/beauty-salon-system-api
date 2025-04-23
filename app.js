const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.set("io", io);

const ioCreateTimeReserve = io.of("/websocket/timeReserveCreate");
ioCreateTimeReserve.on("connection" , (socket) => {
  console.log("[Create] Socket connected:", socket.id);

  socket.on("join" , (userId) => {
    socket.join(`timeReserveCreateRoom:${userId}`);
    console.log(`User ${userId} joined create room`);
  })
})
app.set("ioCreateTimeReserve", ioCreateTimeReserve);

const ioUpdateTimeReserve  = io.of("/websocket/timeReserveUpdate");
ioUpdateTimeReserve.on("connection", (socket) => {
  console.log("[Update] Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(`timeReserveUpdateRoom:${userId}`);
    console.log(`User ${userId} joined update room`);
  });
});
app.set("ioUpdateTimeReserve", ioUpdateTimeReserve);

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const userRoutes = require("./src/routes/user.route");
const customerRoutes = require("./src/routes/customer.route");
const serviceRoutes = require("./src/routes/service.route");
const timeRequestRoutes = require("./src/routes/timeRequest.route");
const scheduleRoutes = require("./src/routes/schedule.route");
const timeReserveRoutes = require("./src/routes/timeReserve.route");
const serviceCategoryRoutes = require("./src/routes/serviceCategory.route");
const serviceVariantRoutes = require("./src/routes/serviceVariant.route");
const workerLevelRoutes = require("./src/routes/workerLevel.route");
const productRoutes = require("./src/routes/product.route");
const productCategoryRoutes = require("./src/routes/productCategory.route");
const productVariantRoutes = require("./src/routes/productVariant.route");
const cartItemRoutes = require("./src/routes/cartItem.route");
const orderRoutes = require("./src/routes/order.route");
const reportRoutes = require("./src/routes/report.route");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/customers" , customerRoutes);
app.use("/api/v1/services" , serviceRoutes);
app.use("/api/v1/schedules" , scheduleRoutes);
app.use("/api/v1/timeRequests" , timeRequestRoutes);
app.use("/api/v1/timeReserves" , timeReserveRoutes);
app.use("/api/v1/serviceCategories" , serviceCategoryRoutes);
app.use("/api/v1/serviceVariants" , serviceVariantRoutes);
app.use("/api/v1/workerLevels" , workerLevelRoutes);
app.use("/api/v1/products" , productRoutes);
app.use("/api/v1/productCategories" , productCategoryRoutes);
app.use("/api/v1/productVariants" , productVariantRoutes);
app.use("/api/v1/cartItems" , cartItemRoutes);
app.use("/api/v1/orders" , orderRoutes);
app.use("/api/v1/reports" , reportRoutes);


app.use('/' , async(req , res) => {
  try {
      return res.send("<h1>Beauty salon api</h1>");
  } catch(err) {
    console.log(err);
  }
})

server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});