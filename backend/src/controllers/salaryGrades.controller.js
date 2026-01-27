const ApiError = require("../utils/ApiError");
const service = require("../services/salaryGrades.service");

module.exports = {
  async list(req, res, next) {
    try {
      const result = await service.list(req.query);
      res.json({ success: true, ...result });
    } catch (e) { next(e); }
  },

  async getById(req, res, next) {
    try {
      const data = await service.getById(req.params.id);
      if (!data) throw new ApiError(404, "Salary grade not found");
      res.json({ success: true, data });
    } catch (e) { next(e); }
  },

  async create(req, res, next) {
    try {
      if (!req.body.gradeName)
        throw new ApiError(400, "gradeName is required");

      if (!req.body.coefficient)
        throw new ApiError(400, "coefficient is required");

      const data = await service.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (e) { next(e); }
  },

  async update(req, res, next) {
    try {
      const data = await service.update(req.params.id, req.body);
      if (!data) throw new ApiError(404, "Salary grade not found");
      res.json({ success: true, data });
    } catch (e) { next(e); }
  },

  async remove(req, res, next) {
    try {
      const ok = await service.remove(req.params.id);
      if (!ok) throw new ApiError(404, "Salary grade not found");
      res.json({ success: true, message: "Deleted" });
    } catch (e) { next(e); }
  }
};
