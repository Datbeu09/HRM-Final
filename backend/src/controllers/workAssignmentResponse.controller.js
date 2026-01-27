const ApiError = require("../utils/ApiError");
const service = require("../services/workAssignmentResponse.service");

function validateCreate(body) {
  if (!body.workAssignmentId)
    throw new ApiError(400, "workAssignmentId is required");

  if (!body.employeeId)
    throw new ApiError(400, "employeeId is required");

  if (!body.status)
    throw new ApiError(400, "status is required");
}

module.exports = {
  async list(req, res, next) {
    try {
      const data = await service.list(req.query);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await service.getById(req.params.id);
      if (!data) throw new ApiError(404, "Response not found");
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      validateCreate(req.body);
      const data = await service.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const data = await service.update(req.params.id, req.body);
      if (!data) throw new ApiError(404, "Response not found");
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      const ok = await service.remove(req.params.id);
      if (!ok) throw new ApiError(404, "Response not found");
      res.json({ success: true, message: "Deleted" });
    } catch (e) {
      next(e);
    }
  }
};
