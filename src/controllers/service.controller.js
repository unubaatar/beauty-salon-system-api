const User = require("../models/user");
const Service = require("../models/service");

exports.create = async(req , res , next) => {
    try {
        const { title ,  description , body  , price , image , workers} = req.body;
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

exports.list = async(req , res , next) => {
    try {
        const { page = 1 , per_page = 10 , filter } = req.body; 
        const query = {};
        const count = await Service.countDocuments({});
        const services = await Service.find(query)
            .skip((page - 1 ) * per_page)
            .limit(per_page)
            .populate("workers")
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
        .populate("workers")
    return res.status(200).json({ count: count , rows: services });
    } catch(err) {
        console.log(err);
        next(err);
    }
}

