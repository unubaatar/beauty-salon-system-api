const Schedule = require("../models/schedule");
const TimeRequest = require("../models/timeRequest");

exports.create = async(req , res , next) => {
    try {
        console.log("create");
    } catch(err) {
        console.log(err);
        next(err);
    }
}

exports.reserve = async(req , res , next) => {
    try {
        const { _id , customer , service } = req.body;
        const reservedTimeRequest = await TimeRequest.findById(_id);
        if(!reservedTimeRequest) {
            return res.status(404).json({ message: "Error occured" });
        };
        if(reservedTimeRequest.state !== "free") {
            return res.status(404).json({ message: "Time is not free" });
        }
        reservedTimeRequest.customer = customer;
        reservedTimeRequest.service = service;
        reservedTimeRequest.state = "reserved";
        await reservedTimeRequest.save();
        const reservedSchedule = await Schedule.findById(reservedTimeRequest.schedule);
        console.log(reservedSchedule)
        reservedSchedule.totalService += 1;
        console.log(reservedSchedule.totalService);
        await reservedSchedule.save();
        return res.status(200).json(reservedTimeRequest);
    } catch(err) {
        console.log(err);
        next(err);
    }
}

exports.getByDate = async(req , res , next) => {
    try {
        const { date } = req.body;
    } catch(err) {
        console.log(err);
        next(err);
    }
}

exports.getByServiceAndWorker = async(req , res , next) => {
    try {

    } catch(err) {
        console.log(err);
    }
}