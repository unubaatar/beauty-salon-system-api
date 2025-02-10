const TimeRequest = require("../models/timeRequest");

exports.create = async(req , res , next) => {
    try {
        console.log("create");
    } catch(err) {
        console.log(err);
        next(err);
    }
}

exports.orderTime = async(req , res , next) => {
    try {
        const { _id , ...body } = req.body;
        const orderedTimeReq = await TimeRequest.findByIdAndUpdate(_id , body);
        if(!orderedTimeReq) {
            return res.status(404).json({ message: "Error occured" });
        }
        return res.status(200).json(orderedTimeReq);
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