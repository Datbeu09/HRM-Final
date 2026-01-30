const service = require("../services/attendance.service");

exports.getMeAttendance = async (req, res, next) => {
  try {
    const data = await service.getMeAttendance({ user: req.user });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

exports.checkIn = async (req, res, next) => {
  try {
    const data = await service.checkIn({ user: req.user });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

exports.checkOut = async (req, res, next) => {
  try {
    const data = await service.checkOut({ user: req.user });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

exports.getRecent = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 4);
    const data = await service.getRecent({ user: req.user, limit });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

exports.getMonthlySummary = async (req, res, next) => {
  try {
    const month = Number(req.query.month);
    const year = Number(req.query.year);
    const data = await service.getMonthlySummary({ user: req.user, month, year });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

// ===== cái bạn đã có =====
exports.getEmployeeMonthDetail = async (req, res, next) => {
  try {
    const { employeeId, month, year } = req.query;
    const data = await service.getEmployeeMonthDetail({
      employeeId: +employeeId,
      month: +month,
      year: +year,
    });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

exports.updateDaily = async (req, res, next) => {
  try {
    const data = await service.updateDaily({
      id: +req.params.id,
      payload: req.body,
      user: req.user,
    });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
