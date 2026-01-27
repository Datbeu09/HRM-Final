// src/controllers/benefits.controller.js
const ApiError = require("../utils/ApiError");
const service = require("../services/benefits.service");

module.exports = {
  // GET /api/benefits
  async list(req, res, next) {
    try {
      const rows = await service.list();
      res.json({ success: true, data: rows });
    } catch (e) {
      next(e);
    }
  },

  // GET /api/benefits/employee/:employeeId
  async getByEmployee(req, res, next) {
    try {
      const { employeeId } = req.params;
      const rows = await service.getByEmployeeId(employeeId);
      res.json({ success: true, data: rows });
    } catch (e) {
      next(e);
    }
  },

  // POST /api/benefits
  async create(req, res, next) {
    try {
      const created = await service.create(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (e) {
      next(e);
    }
  },

  // PUT /api/benefits/:id
  async update(req, res, next) {
    try {
      const updated = await service.update(req.params.id, req.body);
      if (!updated) throw new ApiError(404, "Benefit not found");
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  // DELETE /api/benefits/:id
  async remove(req, res, next) {
    try {
      const ok = await service.remove(req.params.id);
      if (!ok) throw new ApiError(404, "Benefit not found");
      res.json({ success: true, message: "Deleted" });
    } catch (e) {
      next(e);
    }
  },
};
