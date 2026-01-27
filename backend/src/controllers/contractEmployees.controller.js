// src/controllers/contractEmployees.controller.js
const ApiError = require("../utils/ApiError");
const service = require("../services/contractEmployees.service");

function validateCreate(body) {
  if (!body.employeeId) throw new ApiError(400, "employeeId is required");
  if (body.agreedSalary === undefined || body.agreedSalary === null)
    throw new ApiError(400, "agreedSalary is required");
}

module.exports = {
  // ===== GET ALL =====
  async list(req, res, next) {
    try {
      const data = await service.list();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  // ===== GET BY EMPLOYEE =====
  async getByEmployeeId(req, res, next) {
    try {
      const row = await service.getByEmployeeId(req.params.employeeId);
      if (!row) throw new ApiError(404, "Contract employee not found");
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  // ===== CREATE =====
  async create(req, res, next) {
    try {
      validateCreate(req.body);
      const created = await service.create(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (e) {
      next(e);
    }
  },

  // ===== UPDATE =====
  async update(req, res, next) {
    try {
      const updated = await service.update(req.params.employeeId, req.body);
      if (!updated) throw new ApiError(404, "Contract employee not found");
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  // ===== DELETE =====
  async remove(req, res, next) {
    try {
      const ok = await service.remove(req.params.employeeId);
      if (!ok) throw new ApiError(404, "Contract employee not found");
      res.json({ success: true, message: "Deleted" });
    } catch (e) {
      next(e);
    }
  },
};
