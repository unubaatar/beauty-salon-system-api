const TimeReserve = require("../models/timeReserve");
const TimeRequest = require("../models/timeRequest");
const Schedule = require("../models/schedule");
const Service = require("../models/service");
const ServiceVariant = require("../models/serviceVariant");
const User = require("../models/user");
const POSSIBLE_TIMES = require("../constants/possibleTimes");

exports.create = async (req, res, next) => {
  try {
    const { customer, services, schedule, startTime, additionalPrices } =
      req.body;

    if (!customer || !services || !schedule || !startTime) {
      return res.status(404).json({ message: "Insert all fields" });
    }

    let totalDuration = 0;
    let totalAmount = 0;

    await Promise.all(
      services.map(async (service) => {
        const foundService = await Service.findById(service.service);
        if (service.variant) {
          const foundVariant = await ServiceVariant.findById(service.variant);
          totalDuration += foundVariant.duration;
          totalAmount += foundVariant.price;
        } else {
          totalDuration += foundService.duration;
          totalAmount += foundService.price;
        }
      })
    );

    services.forEach((service) => {
      const matchingFee = additionalPrices.find(
        (fee) => fee.service === service.service
      );
      if (matchingFee) {
        service.price += matchingFee.price;
      }
    });

    if (additionalPrices) {
      additionalPrices.map((price) => {
        totalAmount += price.price;
      });
    }

    const foundSchedule = await Schedule.findById(schedule).populate(
      "timeRequests"
    );
    const startSection = POSSIBLE_TIMES.indexOf(startTime);
    const endSection =
      POSSIBLE_TIMES.indexOf(startTime) + Math.ceil(totalDuration / 30);
    if (endSection > POSSIBLE_TIMES.length) {
      return res.status(404).json({ message: "Duration is too high" });
    }

    for (let i = startSection; i < endSection; i++) {
      if (foundSchedule.timeRequests[i].hasReserved) {
        return res.status(404).json({ message: "Already registered" });
      }
    }

    for (let i = startSection; i < endSection; i++) {
      foundSchedule.timeRequests[i].hasReserved = true;
      await foundSchedule.timeRequests[i].save();
    }
    foundSchedule.totalServices += 1;
    await foundSchedule.save();

    const startDate = new Date(
      `${foundSchedule.dateTitle}T${POSSIBLE_TIMES[startSection]}`
    );
    const endDate = new Date(
      `${foundSchedule.dateTitle}T${POSSIBLE_TIMES[endSection]}`
    );

    const year = startDate.getFullYear() % 100;
    const month = String(startDate.getMonth() + 1).padStart(2, "0");
    const day = String(startDate.getDate()).padStart(2, "0");
    const hours = String(startDate.getHours()).padStart(2, "0");
    const minutes = String(startDate.getMinutes()).padStart(2, "0");

    const timeReserveNumber = `TS${year}${month}${day}${hours}${minutes}`;

    const params = {
      customer: customer,
      services: services,
      schedule: schedule,
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      totalDuration: totalDuration,
      totalAmount: totalAmount,
      dateTitle: foundSchedule.dateTitle,
      additionalPrices: additionalPrices,
      timeReserveNumber: timeReserveNumber,
    };

    const newTimeReserve = new TimeReserve(params);
    await newTimeReserve.save();

    foundSchedule.timeReserves.push(newTimeReserve);
    await foundSchedule.save();
    return res.status(200).json(newTimeReserve);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { _id, ...body } = req.body;

    const foundTimeReserve = await TimeReserve.findById(_id)
      .populate([
        {
          path: "schedule",
          select: "worker",
          populate: {
            path: "worker",
            populate: {
              path: "level",
            },
          },
        },
        {
          path: "services",
          populate: {
            path: "service",
            populate: {
              path: "variants category",
            },
          },
        },
        {
          path: "services",
          populate: {
            path: "variant duration",
            // select: "title"
          },
        },
      ])
      .populate({
        path: "additionalPrices.service",
        select: "title",
      })
      .populate({
        path: "customer",
        select: "firstName lastName phone email avatar",
      });
    if (!foundTimeReserve) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(foundTimeReserve);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.body;
    const foundTimeReserves = await TimeReserve.find({ customer: customerId })
      .populate({
        path: "customer",
        select: "firstName lastName phone email avatar",
      })
      .populate([
        {
          path: "services",
          populate: {
            path: "service",
            populate: {
              path: "variants category",
            },
          },
        },
        {
          path: "services",
          populate: {
            path: "variant duration",
            // select: "title"
          },
        },
      ]);
    const foundTimeReservesCount = await TimeReserve.countDocuments({
      customer: customerId,
    });
    if (!foundTimeReserves) {
      return res.status(400).json({ message: "Not found" });
    }
    return res
      .status(200)
      .json({ count: foundTimeReservesCount, rows: foundTimeReserves });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const foundTimeReserve = await TimeReserve.findByIdAndUpdate(_id, req.body);
    if (!foundTimeReserve) {
      return res.status(400).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "Successful" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getByUserReport = async (req, res, next) => {
  try {
    const { dateFilter } = req.body;

    const date1 = new Date(dateFilter[0]);
    const date2 = new Date(dateFilter[1]);

    const [fromDate, toDate] =
      date1.getTime() <= date2.getTime()
        ? [dateFilter[0], dateFilter[1]]
        : [dateFilter[1], dateFilter[0]];

    const timeReserves = await TimeReserve.find({
      dateTitle: { $gte: fromDate, $lte: toDate },
    }).populate("schedule");

    const users = await User.find({ role: "worker" }).select(
      "firstName lastName avatar role email phone"
    );

    let reportData = [];

    for (let user of users) {
      const userData = {
        userId: user,
        timeReserves: [],
      };
      for (let timeReserve of timeReserves) {
        if (timeReserve.schedule.worker.toString() === user._id.toString()) {
          userData.timeReserves.push(timeReserve);
        }
      }
      reportData.push(userData);
    }
    let lastReportData = [];

    for (let data of reportData) {
      let totalServiceCount = 0;
      let totalWOrkedDuration = 0;
      let totalIncome = 0;
      for (let timeReserve of data.timeReserves) {
        totalServiceCount += timeReserve.services.length;
        totalWOrkedDuration += timeReserve.totalDuration;
        totalIncome += timeReserve.totalAmount;
      }
      lastReportData.push({
        worker: data.userId,
        totalServiceCount: totalServiceCount,
        totalWOrkedDuration: totalWOrkedDuration,
        totalIncome: totalIncome,
        totalTimeReserve: data.timeReserves.length,
      });
    }

    let totalIncome = 0;
    let totalServiceCount = 0;

    for (let item of lastReportData) {
      totalIncome += item.totalIncome;
    }

    for (let item of lastReportData) {
      totalServiceCount += item.totalServiceCount;
    }

    return res
      .status(200)
      .json({ totalIncome, totalServiceCount, rows: lastReportData });
  } catch (err) {
    console.error("Error fetching user report:", err);
    next(err);
  }
};
