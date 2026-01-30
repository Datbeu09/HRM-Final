// src/controllers/workAssignmentResponses.controller.js
const service = require("../services/workAssignmentResponse.service");
const ApiError = require("../utils/ApiError");

module.exports = {
  async list(req, res, next) {
    try {
      const { workAssignmentId, employeeId } = req.query;
      const data = await service.list({ workAssignmentId, employeeId });
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async listMy(req, res, next) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) throw new ApiError(401, "Missing employeeId in token");

      const { workAssignmentId } = req.query;
      const data = await service.list({ workAssignmentId, employeeId });
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) throw new ApiError(401, "Missing employeeId in token");

      const data = await service.create({
        ...req.body,
        employeeId, // ✅ override chống giả mạo
      });

      res.status(201).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },
};
