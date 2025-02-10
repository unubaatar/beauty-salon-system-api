const User = require("../models/user");
const Schedule = require("../models/schedule");
const TimeRequest = require("../models/timeRequest");
const timeRequests = require("../constants/timeRequests");

exports.create = async (req, res, next) => {
  try {
    const { date, worker, day } = req.body;

    if (!date || !worker || !day) {
      return res.status(404).json({ message: "Insert all required fields" });
    }

    const newSchedule = new Schedule({ date, worker, day });
    await newSchedule.save();

    const timeRequestDocs = timeRequests.map((timeReq) => ({
      time: timeReq,
      schedule: newSchedule._id,
    }));

    const insertedTimeRequests = await TimeRequest.insertMany(timeRequestDocs);

    newSchedule.timeRequests.push(...insertedTimeRequests.map((tr) => tr._id));
    await newSchedule.save();
    return res.status(201).json({ schedule: newSchedule });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { filter } = req.body;
    let query = {};
    if (filter && filter.dates) {
        const startDate = filter.dates[0];
        const endDate = filter.dates[1];
        query = {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        };
    }
    const schedules = await Schedule.find(query)
        .populate("timeRequests");
    return res.status(200).json({ rows: schedules });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
