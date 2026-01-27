const monthlyAttendanceService = require("../services/monthlyAttendance.service");
const ApiError = require("../utils/ApiError");

module.exports = {
  // GET /monthly-attendance
  async getAll(req, res, next) {
    try {
      const data = await monthlyAttendanceService.getAll();
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(new ApiError(500, err.message));
    }
  },

  // GET /monthly-attendance/:id
  async getById(req, res, next) {
    try {
      const data = await monthlyAttendanceService.getById(req.params.id);
      if (!data) return next(new ApiError(404, "Not found"));
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(new ApiError(500, err.message));
    }
  },

  // GET /monthly-attendance/employee/:employeeId
  async getByEmployee(req, res, next) {
    try {
      const data = await monthlyAttendanceService.getByEmployee(req.params.employeeId);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(new ApiError(500, err.message));
    }
  },

  // POST /monthly-attendance
  async create(req, res, next) {
    try {
      const id = await monthlyAttendanceService.create(req.body);
      const data = await monthlyAttendanceService.getById(id);
      res.status(201).json({ success: true, message: "Created", data });
    } catch (err) {
      next(new ApiError(500, err.message));
    }
  },

  // PUT /monthly-attendance/:id
  async update(req, res, next) {
    try {
      const data = await monthlyAttendanceService.update(req.params.id, req.body);
      if (!data) return next(new ApiError(404, "Not found"));
      res.status(200).json({ success: true, message: "Updated", data });
    } catch (err) {
      next(new ApiError(500, err.message));
    }
  },

  // DELETE /monthly-attendance/:id
  async remove(req, res, next) {
    try {
      const ok = await monthlyAttendanceService.remove(req.params.id);
      if (!ok) return next(new ApiError(404, "Not found"));
      res.status(200).json({ success: true, message: "Deleted" });
    } catch (err) {
      next(new ApiError(500, err.message));
    }
  },
};
