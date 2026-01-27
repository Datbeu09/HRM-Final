// src/controllers/approvals.controller.js
const ApiError = require("../utils/ApiError");
const service = require("../services/approvals.service");

function validateCreate(body) {
  if (!body.type) throw new ApiError(400, "type is required");
  if (!body.reason) throw new ApiError(400, "reason is required");
  if (!body.startDate) throw new ApiError(400, "startDate is required");
  if (!body.endDate) throw new ApiError(400, "endDate is required");
}

module.exports = {
  async list(req, res, next) {
    try {
      const data = await service.list(req.query, req.user);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const row = await service.getById(req.params.id, req.user);
      if (!row) throw new ApiError(404, "Approval not found");
      res.json({ success: true, data: row });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      validateCreate(req.body);
      const data = await service.create(req.body, req.user);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const data = await service.update(req.params.id, req.body, req.user);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await service.remove(req.params.id, req.user);
      res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      next(err);
    }
  },

  async approve(req, res, next) {
    try {
      const data = await service.approve(req.params.id, req.body, req.user);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async reject(req, res, next) {
    try {
      const data = await service.reject(req.params.id, req.body, req.user);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};
