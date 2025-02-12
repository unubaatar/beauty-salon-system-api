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

