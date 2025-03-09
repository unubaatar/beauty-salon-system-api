const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

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

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/customers" , customerRoutes);
app.use("/api/v1/services" , serviceRoutes);
app.use("/api/v1/schedules" , scheduleRoutes);
app.use("/api/v1/timeRequests" , timeRequestRoutes);
app.use("/api/v1/timeReserves" , timeReserveRoutes);
app.use("/api/v1/serviceCategories" , serviceCategoryRoutes);
app.use("/api/v1/serviceVariants" , serviceVariantRoutes);
app.use("/api/v1/workerLevels" , workerLevelRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
