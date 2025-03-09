const User = require("../models/user");
const Service = require("../models/service");

exports.create = async(req , res , next) => {
    try {
        const { title ,  description , body  , price , image , workers , duration } = req.body;
        if(!title || !description  ||  !price ) {
            return res.status(404).json({ message: "Set all fields" });
        };
        const newService = new Service(req.body);
        await newService.save();
        return res.status(201).json({ message: "Created successfully" });
    } catch(err) {
        console.log(err);
        next(err);
    }
}

exports.update = async(req , res , next) => {
    try {
        const { _id , ...body } = req.body; 
        const service = await Service.findByIdAndUpdate(_id , body);
        if(!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        return res.status(200).json(service);
    } catch(err) {
        console.log(err);
        next(err);
    }
}

exports.getById = async(req , res , next) => {
    try {
        const { _id } = req.body;
        const service = await Service.findById(_id).populate("variants workers").populate({
            path: "additionalPrices",
            populate: "workerLevel"
        });
        if(!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        return res.status(200).json(service);
    } catch(err) {
        console.log(err);
        next(err);
    }
}

exports.list = async(req , res , next) => {
    try {
        const { filter } = req.body; 
        const query = {};
        if(filter && filter.category) {
            query.category = filter.category;
        };
        const count = await Service.countDocuments({});
        const services = await Service.find(query)
            // .skip((page - 1 ) * per_page)
            // .limit(per_page)
            .populate("workers category")
            .sort({ createdAt: -1 });
        return res.status(200).json({ count: count , rows: services });
    } catch(err) {
        console.log(err);
        next(err);
    }
}

exports.all = async(req , res , next) => {
    try {
        const count = await Service.countDocuments({});
        const services = await Service.find({})
        .populate("workers category")
        .sort({ createdAt: -1 });
    return res.status(200).json({ count: count , rows: services });
    } catch(err) {
        console.log(err);
        next(err);
    }
}

exports.getWorkerByService = async (req, res, next) => {
    try {
        const { services } = req.body;

        const foundServices = await Service.find({ _id: { $in: services } }).populate('workers');

        let allWorkers = [];

        foundServices.forEach(service => {
            service.workers.forEach(worker => {
                if (!allWorkers.some(existingWorker => existingWorker.id === worker.id)) {
                    allWorkers.push(worker);
                }
            });
        });
        

        let uniqueWorkers = [];

        for(let worker of allWorkers ) {
            let count = 0;
            for(let service of foundServices) {
                if(service.workers.some( serviceWorker => serviceWorker._id == worker._id )) {
                    count++;
                }
            };
            if(count == foundServices.length) {
                uniqueWorkers.push(worker);
            }
        }

        return res.status(200).json(uniqueWorkers );
    } catch (err) {
        console.log(err);
        next(err);
    }
};
