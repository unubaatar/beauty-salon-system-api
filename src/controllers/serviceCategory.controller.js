const ServiceCategory = require("../models/serviceCategory");

exports.create = async(req , res , next) => {
    try {
        const { title , description } = req.body;
        if(!title) {
            return res.status(404).json({ message: "Insert all fields" });
        }
        const newCategory = new ServiceCategory(req.body);
        await newCategory.save();
        return res.status(201).json(newCategory);
    } catch(err) {
        console.log(err);
        next(err);
    }
}

exports.update = async(req , res , next) => {
    try {
        const { _id , ...body } = req.body;
        const foundCategory = await ServiceCategory.findByIdAndUpdate(_id , body);
        if(!foundCategory) {
            return res.status(404).json({ message: "Not found" });
        }
        return res.status(200).json({ message: "Successful" });
    } catch(err) {
        console.log(err);
        next(err);
    }
}

exports.list = async(req , res , next) => {
    try {
        const {} = req.body;
        const list = await ServiceCategory.find({});
        const count = await ServiceCategory.countDocuments({});
        return res.status(200).json({count: count,  rows: list  });

    } catch(err) {
        console.log(err);
        next(err);
    }
}
