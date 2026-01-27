const ApiError = require("../utils/ApiError");
const service = require("../services/positions.service");

function validateCreate(body) {
  if (!body.positionName)
    throw new ApiError(400, "positionName is required");

  if (body.positionCode !== undefined && body.positionCode === "")
    throw new ApiError(400, "positionCode cannot be empty");
}

function validateUpdate(body) {
  if (body.positionName !== undefined && body.positionName === "")
    throw new ApiError(400, "positionName cannot be empty");

  if (body.positionCode !== undefined && body.positionCode === "")
    throw new ApiError(400, "positionCode cannot be empty");
}

module.exports = {
  async list(req, res, next) {
    try {
      const result = await service.list(req.query);
      res.json({ success: true, ...result });
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const row = await service.getById(req.params.id);
      if (!row) throw new ApiError(404, "Position not found");
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      validateCreate(req.body);
      const created = await service.create(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      validateUpdate(req.body);
      const updated = await service.update(req.params.id, req.body);
      if (!updated) throw new ApiError(404, "Position not found");
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      const ok = await service.remove(req.params.id);
      if (!ok) throw new ApiError(404, "Position not found");
      res.json({ success: true, message: "Deleted successfully" });
    } catch (e) {
      next(e);
    }
  }
};
