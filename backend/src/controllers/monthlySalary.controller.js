const service = require("../services/monthlySalary.service");
const ApiError = require("../utils/ApiError");

module.exports = {
  // ===== CRUD =====

  // GET /monthly-salary
  async getAll(req, res, next) {
    try {
      const data = await service.getAll();
      res.json({ success: true, data });
    } catch (e) {
      next(new ApiError(500, e.message));
    }
  },

  // GET /monthly-salary/:id
  async getById(req, res, next) {
    try {
      const data = await service.getById(req.params.id);
      if (!data) return next(new ApiError(404, "Monthly salary not found"));
      res.json({ success: true, data });
    } catch (e) {
      next(new ApiError(500, e.message));
    }
  },

  // GET /monthly-salary/employee/:employeeId
  async getByEmployee(req, res, next) {
    try {
      const data = await service.getByEmployee(req.params.employeeId);
      res.json({ success: true, data });
    } catch (e) {
      next(new ApiError(500, e.message));
    }
  },

  // POST /monthly-salary
  async create(req, res, next) {
    try {
      const id = await service.create(req.body);
      const data = await service.getById(id);
      res.status(201).json({ success: true, data });
    } catch (e) {
      next(new ApiError(500, e.message));
    }
  },

  // PUT /monthly-salary/:id
  async update(req, res, next) {
    try {
      const data = await service.update(req.params.id, req.body);
      if (!data) return next(new ApiError(404, "Monthly salary not found"));
      res.json({ success: true, data });
    } catch (e) {
      next(new ApiError(500, e.message));
    }
  },

  // DELETE /monthly-salary/:id
  async remove(req, res, next) {
    try {
      const ok = await service.remove(req.params.id);
      if (!ok) return next(new ApiError(404, "Monthly salary not found"));
      res.json({ success: true, message: "Deleted" });
    } catch (e) {
      next(new ApiError(500, e.message));
    }
  },
};
