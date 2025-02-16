const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    worker: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    dateTitle: {
        type: String ,
        required: true
    },
    timeRequests: [
        {
            type: Schema.Types.ObjectId,
            ref: "TimeRequest"
        }
    ],
    timeReserves: [
        {
            type: Schema.Types.ObjectId,
            ref: "TimeReserve"
        }
    ],
    day: {
        type: String,
        required: true
    },
    totalIncome: {
        type: Number,
        default: 0
    },
    totalServices: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

const Schedule = mongoose.model("Schedule" , scheduleSchema);
module.exports = Schedule;
