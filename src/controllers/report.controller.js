const Order = require("../models/order");
const TimeReserve = require("../models/timeReserve");

exports.getTodayData = async (req, res, next) => {
  try {
    const localDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Ulaanbaatar",
    });

    const localNow = new Date(localDate);

    const yyyy = localNow.getFullYear();
    const mm = String(localNow.getMonth() + 1).padStart(2, "0");
    const dd = String(localNow.getDate()).padStart(2, "0");
    const todayDateStr = `${yyyy}-${mm}-${dd}`;

    const startOfToday = new Date(`${todayDateStr}T00:00:00+08:00`);
    const endOfToday = new Date(`${todayDateStr}T23:59:59.999+08:00`);

    const timeReserves = await TimeReserve.find({
      dateTitle: todayDateStr,
    }).populate("schedule");

    const orders = await Order.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const timeReserveCount = timeReserves.length;
    const orderCount = orders.length;

    let totalIncomeFromTimeReserve = 0;
    let totalIncomeFromOrder = 0;

    timeReserves.forEach((timeReserve) => {
      totalIncomeFromTimeReserve += timeReserve.totalAmount;
    });

    orders.forEach((order) => {
      totalIncomeFromOrder += order.totalAmount;
    });

    return res
      .status(200)
      .json({
        timeReserveCount,
        orderCount,
        totalIncomeFromTimeReserve,
        totalIncomeFromOrder,
      });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getLastTenDaysData = async (req, res, next) => {
    try {
      const localDateStr = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Ulaanbaatar"
      });
      const localNow = new Date(localDateStr);
  
      const tenDaysAgo = new Date(localNow);
      tenDaysAgo.setDate(localNow.getDate() - 9);
  
      const formatDate = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };
  
      const startDateStr = formatDate(tenDaysAgo);
      const endDateStr = formatDate(localNow);
  
      const startDate = new Date(`${startDateStr}T00:00:00+08:00`);
      const endDate = new Date(`${endDateStr}T23:59:59.999+08:00`);
  
      const timeReserves = await TimeReserve.find({
        dateTitle: { $gte: startDateStr, $lte: endDateStr }
      }).populate("schedule").lean();
  
      const orders = await Order.find({
        createdAt: { $gte: startDate, $lte: endDate }
      }).lean();
  
      const groupedTR = {};
      timeReserves.forEach(tr => {
        if (!groupedTR[tr.dateTitle]) groupedTR[tr.dateTitle] = [];
        groupedTR[tr.dateTitle].push(tr);
      });

      const groupedOrders = {};
      orders.forEach(order => {
        const localCreatedStr = new Date(order.createdAt).toLocaleString("en-US", {
          timeZone: "Asia/Ulaanbaatar",
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        });
        const [month, day, year] = localCreatedStr.split("/");
        const dateKey = `${year}-${month}-${day}`;
  
        if (!groupedOrders[dateKey]) groupedOrders[dateKey] = [];
        groupedOrders[dateKey].push(order);
      });
  
      const result = [];
      const current = new Date(startDateStr);
      while (current <= new Date(endDateStr)) {
        const dateKey = formatDate(current);
        result.push({
          dateTitle: dateKey,
          timeReserves: groupedTR[dateKey] || [],
          orders: groupedOrders[dateKey] || []
        });
        current.setDate(current.getDate() + 1);
      }
    
      let incomeData = [];

      result.map((dataItem) => {
        let totalIncome = 0;
        for(let order of dataItem.orders) {
            totalIncome += order.totalAmount;
        };

        for(let timeReserve of dataItem.timeReserves) {
            totalIncome += timeReserve.totalAmount
        };

        incomeData.push({
            dateTitle: dataItem.dateTitle,
            totalIncome: totalIncome
        })
      });
      incomeData = incomeData.reverse();
      return res.status(200).json(incomeData);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  exports.getTotalMonthIncome = async (req, res, next) => {
    try {
      const localDateString = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Ulaanbaatar",
      });
      const localNow = new Date(localDateString);
  
      const startOfMonth = new Date(
        localNow.getFullYear(),
        localNow.getMonth(),
        1,
        0,
        0,
        0,
        0
      );
      const endOfMonth = new Date(
        localNow.getFullYear(),
        localNow.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
  
      const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };
  
      const startDateStr = formatDate(startOfMonth);
      const endDateStr = formatDate(endOfMonth);
      const orders = await Order.find({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }).lean();
  
      const timeReserves = await TimeReserve.find({
        dateTitle: { $gte: startDateStr, $lte: endDateStr },
      }).lean();
  
      const totalOrderIncome = orders.reduce((sum, order) => {
        return sum + (order.totalAmount || 0);
      }, 0);

      const totalTimeReserveIncome = timeReserves.reduce((sum, tr) => {
        return sum + (tr.totalAmount || 0);
      }, 0);
  
      const totalIncome = totalOrderIncome + totalTimeReserveIncome;

      return res.status(200).json({
        totalIncome,
        totalOrderIncome,
        totalTimeReserveIncome,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  