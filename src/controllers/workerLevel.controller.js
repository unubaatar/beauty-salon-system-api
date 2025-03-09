const WorkerLevel = require("../models/workerLevel");

exports.create = async(req , res , next) => {
    try {
        const { level , image } = req.body;
        if(!level) {
            return res.staus(404).json({ message: "Алдаа заалаа"  });
        }
        const newWorkerLevel = new WorkerLevel(req.body);
        await newWorkerLevel.save();
        return res.status(201).json(newWorkerLevel);
    } catch(err) {
        console.log(err);
        next(err);
    }
}

exports.update = async(req , res , next) => {
    try {
        const { _id , ...body } = req.body;
        const workerLevel = await WorkerLevel.findByIdAndUpdate(_id , req.body);
        if(!workerLevel) {
            return res.staus(400).json({ message: "Not found" });
        };
        return res.status(200).json({ message: "Updated successfully" });
    } catch(err) {
        console.log(err);
        next(err);
    }
}

exports.all = async(req , res , next) => {
    try {
        const totalLevels = await WorkerLevel.find({});
        const count = await WorkerLevel.countDocuments({});
        return res.status(200).json({ count: count , rows: totalLevels })
    } catch(err) {
        console.log(err);
        next(err);
    }
}