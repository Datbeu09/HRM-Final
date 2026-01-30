// src/controllers/workAssignmentResponses.controller.js
const service = require("../services/workAssignmentResponse.service");

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

  async create(req, res, next) {
    try {
      const data = await service.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },
};
