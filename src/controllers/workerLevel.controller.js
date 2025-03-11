const WorkerLevel = require("../models/workerLevel");
const Service = require("../models/service");

exports.create = async (req, res, next) => {
  try {
    const { level, image } = req.body;
    if (!level) {
      return res.status(404).json({ message: "Алдаа заалаа" });
    }
    const newWorkerLevel = new WorkerLevel(req.body);
    await newWorkerLevel.save();
    return res.status(201).json(newWorkerLevel);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id, ...body } = req.body;
    const workerLevel = await WorkerLevel.findByIdAndUpdate(_id, req.body);
    if (!workerLevel) {
      return res.staus(400).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.all = async (req, res, next) => {
  try {
    const totalLevels = await WorkerLevel.find({});
    const count = await WorkerLevel.countDocuments({});
    return res.status(200).json({ count: count, rows: totalLevels });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getAdditionalFee = async (req, res, next) => {
  try {
    const { services, workerLevel } = req.body;
    if (!services || !workerLevel) {
      return res.status(400).json({ message: "Insert all fields" });
    }

    const foundLevel = await WorkerLevel.findById(workerLevel);
    if (!foundLevel) {
      return res.status(400).json({ message: "Worker level not found" });
    }

    const foundServices = await Service.find({ _id: { $in: services } }).select(
      "title hasAdditionalPrice additionalPrices"
    );
    if (!foundServices.length) {
      return res.status(404).json({ message: "No services found" });
    }

    const serviceAdditions = foundServices.reduce((acc, service) => {
      if (service.hasAdditionalPrice) {
        const foundAddPrice = service.additionalPrices.find(
          (additionalPrice) =>
            additionalPrice.workerLevel.toString() === workerLevel
        );

        if (foundAddPrice) {
          acc.push({
            _id: service._id,
            title: service.title,
            addPrice: foundAddPrice.additionalPrice,
          });
        }
      }
      return acc;
    }, []);

    return res.status(200).json(serviceAdditions);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
