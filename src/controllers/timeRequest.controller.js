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

exports.getPossibleTimes = async(req , res , next) => {
    try {
        const { worker , dateTitle , duration } = req.body;

        const schedule = await Schedule.findOne({ worker: worker , dateTitle: dateTitle });
        if(!schedule) {
            return res.status(400).json({ message: "Цаг олдсонгүй" });
        }
        const bookingTimes = await TimeRequest.find({ schedule: schedule , hasReserved: false });
        const count = await TimeRequest.countDocuments({ schedule: schedule , hasReserved: false});

        const totalBookingTimes = await TimeRequest.find({ schedule: schedule });



        let totalPossibleTimes = [];

        const durationSize = Math.ceil(duration / 30);
        for(let time of bookingTimes) {
            const index = totalBookingTimes.findIndex(timeToFind => timeToFind.time === time.time);
            let count = 0;
            for(let i = index ; i < index + durationSize ; i++) {
                if(i < 20 && !totalBookingTimes[i]?.hasReserved  ) {
                    count++;
                }
            };
            if(count == durationSize) {
                totalPossibleTimes.push(time);
            };
        };

        return res.status(200).json({ schedule: schedule._id.toString() ,  rows: totalPossibleTimes  });
    } catch(err) {
        console.log(err);
        next(err);
    }
}