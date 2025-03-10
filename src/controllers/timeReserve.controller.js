const TimeReserve = require("../models/timeReserve");
const TimeRequest = require("../models/timeRequest");
const Schedule = require("../models/schedule");
const Service = require("../models/service");
const ServiceVariant = require("../models/serviceVariant");
const POSSIBLE_TIMES = require("../constants/possibleTimes");

exports.create = async(req , res , next) => {
    try {
        const { customer , services , schedule ,  startTime } = req.body;

        console.log(services);

        if(!customer || !services || !schedule || !startTime) {
            return res.status(404).json({ message: "Insert all fields" })
        };
        
        let totalDuration = 0;
        let totalAmount = 0;

        await services.map(async (service) => {
            const foundService = await Service.findById(service.service);
            if(service.variant) {
                const foundVariant = await ServiceVariant.findById(service.variant);
                totalDuration += foundVariant.duration;
                totalAmount += foundVariant.price;
            } else {
                totalDuration += foundService.duration;
                totalAmount += foundService.price;
            }
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

        for(let i = startSection ; i < endSection ; i++) {
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
            totalAmount: totalAmount,
            dateTitle: foundSchedule.dateTitle
        };

        const newTimeReserve = new TimeReserve(params);
        await newTimeReserve.save();

        foundSchedule.timeReserves.push(newTimeReserve);
        await foundSchedule.save();
        return res.status(200).json(newTimeReserve);
    } catch(err) {
        console.log(err);
        next(err);
    }
}

