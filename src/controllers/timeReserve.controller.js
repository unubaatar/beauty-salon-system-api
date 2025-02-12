const TimeReserve = require("../models/timeReserve");
const TimeRequest = require("../models/timeRequest");
const Schedule = require("../models/schedule");
const Service = require("../models/service");
const POSSIBLE_TIMES = require("../constants/possibleTimes");

exports.create = async(req , res , next) => {
    try {
        const { customer , services , schedule ,  startTime } = req.body;

        if(!customer || !services || !schedule || !startTime) {
            return res.status(404).json({ message: "Insert all fields" })
        };

        const query = {
            _id: { $in: services }
        };
        const foundServices = await Service.find(query);
        
        let totalDuration = 0;
        foundServices.map((service) => {
            totalDuration += service.duration;
        });

        let totalAmount = 0;
        foundServices.map((service) => {
            totalAmount += service.price
        });

        const foundSchedule = await Schedule.findById(schedule).populate("timeRequests");
        const startSection = POSSIBLE_TIMES.indexOf(startTime);
        const endSection = POSSIBLE_TIMES.indexOf(startTime) + Math.ceil(  totalDuration / 30);


        if( endSection >= POSSIBLE_TIMES.length ) {
            return res.status(404).json({ message: "Duration is too high" });
        }

        for(let i = startSection ; i <= endSection ; i++) {
            if(foundSchedule.timeRequests[i].hasReserved) {
                return res.status(404).json({ message: "Already registered" });
            }
        }

        for(let i = startSection ; i <= endSection ; i++) {
            foundSchedule.timeRequests[i].hasReserved = true;
            await foundSchedule.timeRequests[i].save();
        }
        foundSchedule.totalServices += 1;
        await foundSchedule.save();

        const startDate = new Date(`${foundSchedule.dateTitle}T${POSSIBLE_TIMES[startSection]}`);
        const endDate = new Date(`${foundSchedule.dateTitle}T${POSSIBLE_TIMES[endSection]}`);

        const params = {
            customer: customer,
            services: services,
            schedule: schedule,
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            totalDuration: totalDuration,
            totalAmount: totalAmount
        };

        const newTimeReserve = new TimeReserve(params);
        await newTimeReserve.save();
        return res.status(200).json(newTimeReserve);
    } catch(err) {
        console.log(err);
        next(err);
    }
}