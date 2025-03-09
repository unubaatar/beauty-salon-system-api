const ServiceVariant = require("../models/serviceVariant");
const Service = require("../models/service");

exports.create = async (req, res, next) => {
  try {
    const { service, title, body, price, image, duration } = req.body;
    if (!service || !title || !body || !price || !duration) {
      return res.status(400).json({ message: "Insert all fields" });
    }
    const foundService = await Service.findById(service);
    if (!foundService) {
      return res.status(400).json({ message: "Service Not found" });
    }
    const newServiceVariant = new ServiceVariant(req.body);
    await newServiceVariant.save();
    foundService.variants.push(newServiceVariant);
    await foundService.save();
    return res.status(201).json({ message: "Created successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try { 
    const { _id , ...body } = req.body;
    const serviceVariant =  await ServiceVariant.findByIdAndUpdate(_id , body);
    if(!serviceVariant) {
        return res.status(400).json({ message: "Service Variant not found" });
    };
    return res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getByService = async( req , res , next) => {
    try {
        const { service , filter } = req.body;
        let query = {
            service: service
        };
        if(filter && filter.isActive) {
            query.isActive = filter.isActive;
        };
        const variants = await ServiceVariant.find(query);
        const count = await ServiceVariant.countDocuments({ service: service });
        return res.status(200).json({ count: count , rows: variants });
    } catch(err) {
        console.log(err);
        next(err);
    }
}
