const User = require("../models/user");
const Schedule = require("../models/schedule");
const TimeRequest = require("../models/timeRequest");
const timeRequests = require("../constants/timeRequests");
const DAYS = require("../constants/days");
const moment = require("moment");

exports.create = async (req, res, next) => {
  try {
    const { dateTitle, worker, day } = req.body;
    console.log(req.body);
    if (!dateTitle || !worker || !day) {
      return res.status(404).json({ message: "Insert all required fields" });
    }
    const foundSchedule = await Schedule.findOne({ dateTitle: dateTitle , worker: worker , day : day });
    console.log(foundSchedule);
    if(foundSchedule) {
      return res.status(404).json({ message: "Already scheduled" });
    }
    const date = new Date(dateTitle);
    const newSchedule = new Schedule({ dateTitle, worker, day , date });
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
    const schedules = await Schedule.find(query).populate("timeRequests");
    return res.status(200).json({ rows: schedules });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getScheduleByWeek = async (req, res, next) => {
  try {
    const { dates } = req.body;
    const startDate = moment(dates[0]).startOf('day').toDate();
    const endDate = moment(dates[1]).endOf('day').toDate();
    const allDates = [];
    let currentDate = moment(startDate);
    while (currentDate <= moment(endDate)) {
      allDates.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'days');
    }

    let scheduleByDay = [];

    for (let date of allDates) {
        scheduleByDay.push({
          dateTitle: date,
          schedules: []
        });
    }

    for(let i = 0 ; i < DAYS.length ; i++) {
      scheduleByDay[i].day = DAYS[i]; 
    }

    const query = {
      date: {
        $gte: startDate,
        $lte: endDate,
      }
    };

    const schedules = await Schedule.find(query).select("-timeRequests").populate(
      {
        path: "worker",
        select: "firstName lastName role avatar"
      }
    );

    for (let schedule of schedules) {
      const { dateTitle, worker, totalSum, totalService , _id } = schedule;
      let dayGroup = scheduleByDay.find(item => item.dateTitle === dateTitle);

      // if (!dayGroup) {
      //   dayGroup = { dateTitle, schedules: [] };
      //   scheduleByDay.push(dayGroup);
      // }

      dayGroup.schedules.push({
        _id,
        worker,
        totalSum,
        totalService
      });
    }

    return res.status(200).json( scheduleByDay );
  } catch (err) {

  }
};

exports.delete = async(req , res , next) => {
  try {
    const { _id } = req.body;
    const deletedSchedule = await Schedule.findByIdAndDelete(_id);
    if(!deletedSchedule) {
      return res.status(404).json({ message: "Not found" });
    }
    await TimeRequest.deleteMany({ schedule: _id });
    return res.status(200).json({ message: "Deleted successfully" });
  } catch(err) {
    console.log(err);
    next(err);
  }
}
