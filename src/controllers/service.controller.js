const User = require("../models/user");
const Service = require("../models/service");
const timeReserve = require("../models/timeReserve");
const TimeReserve = require("../models/timeReserve");

exports.create = async (req, res, next) => {
  try {
    const { title, description, body, price, image, workers, duration } =
      req.body;
    if (!title || !description || !price) {
      return res.status(404).json({ message: "Set all fields" });
    }
    const newService = new Service(req.body);
    await newService.save();
    return res.status(201).json({ message: "Created successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id, ...body } = req.body;
    const service = await Service.findByIdAndUpdate(_id, body);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    return res.status(200).json(service);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const service = await Service.findById(_id)
      .populate("variants workers")
      .populate({
        path: "additionalPrices",
        populate: "workerLevel",
      })
      .populate("category variants");
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    return res.status(200).json(service);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { filter, page = 1, per_page = 10 } = req.body;
    const query = {};
    if (filter && filter.category) {
      query.category = filter.category;
    }
    const count = await Service.countDocuments({});
    const services = await Service.find(query)
      .skip((page - 1) * per_page)
      .limit(per_page)
      .populate("workers category variants")
      .sort({ createdAt: -1 });
    return res.status(200).json({ count: count, rows: services });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.all = async (req, res, next) => {
  try {
    const count = await Service.countDocuments({});
    const services = await Service.find({})
      .populate("workers category")
      .sort({ createdAt: -1 });
    return res.status(200).json({ count: count, rows: services });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getWorkerByService = async (req, res, next) => {
  try {
    const { services } = req.body;

    const foundServices = await Service.find({
      _id: { $in: services },
    }).populate({
      path: "workers",
      populate: "level",
    });

    let allWorkers = [];

    foundServices.forEach((service) => {
      service.workers.forEach((worker) => {
        if (
          !allWorkers.some((existingWorker) => existingWorker.id === worker.id)
        ) {
          allWorkers.push(worker);
        }
      });
    });

    let uniqueWorkers = [];

    for (let worker of allWorkers) {
      let count = 0;
      for (let service of foundServices) {
        if (
          service.workers.some(
            (serviceWorker) => serviceWorker._id == worker._id
          )
        ) {
          count++;
        }
      }
      if (count == foundServices.length) {
        uniqueWorkers.push(worker);
      }
    }

    return res.status(200).json(uniqueWorkers);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getLatest = async (req, res, next) => {
  try {
    const services = await Service.find({})
      .populate("variants workers")
      .populate({
        path: "additionalPrices",
        populate: "workerLevel",
      })
      .populate("category variants")
      .sort({ createdAt: -1 })
      .limit(4);
    return res.status(200).json(services);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getServiceReport = async (req, res, next) => {
  try {
    const { dateFilter } = req.body;

    const date1 = new Date(dateFilter[0]);
    const date2 = new Date(dateFilter[1]);

    const [fromDate, toDate] =
      date1.getTime() <= date2.getTime()
        ? [dateFilter[0], dateFilter[1]]
        : [dateFilter[1], dateFilter[0]];

    const timeReserves = await TimeReserve.find({
      dateTitle: { $gte: fromDate, $lte: toDate },
    }).populate({
      path: "services",
      populate: {
        path: "service",
        select: "title image",
      },
    });

    let data = [];
    timeReserves.map((timeReserve) => {
      for (let service of timeReserve.services) {
        const foundService = data.find((serviceItem) => {
          return (
            serviceItem.service._id.toString() ===
            service.service._id.toString()
          );
        });
        if (!foundService) {
          data.push({
            service: service.service,
            totalAmount: service.price,
            qty: 1,
          });
        } else {
          foundService.qty++;
          foundService.totalAmount += service.price;
        }
      }
    });

    let totalAmount = 0;
    for (let item of data) {
      totalAmount += item.totalAmount;
    }

    let totalServices = 0;
    for (let item of data) {
      totalServices += item.qty;
    }

    return res.status(200).json({ totalAmount, totalServices, rows: data });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
