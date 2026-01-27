// src/controllers/dailyAttendance.controller.js
const service = require("../services/dailyAttendance.service");
const ApiError = require("../utils/ApiError");

module.exports = {
  // ===== GET ALL =====
  async getAll(req, res, next) {
    try {
      const data = await service.getAll();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  // ===== GET BY ID =====
  async getById(req, res, next) {
    try {
      const row = await service.getById(req.params.id);
      if (!row) throw new ApiError(404, "Daily attendance not found");
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  // ===== GET BY EMPLOYEE + DATE =====
  async getByEmployeeAndDate(req, res, next) {
    try {
      const { employeeId, date } = req.params;
      const rows = await service.getByEmployeeAndDate(employeeId, date);
      res.json({ success: true, data: rows });
    } catch (e) {
      next(e);
    }
  },

  // ===== CREATE =====
  async create(req, res, next) {
    try {
      const insertId = await service.create(req.body);
      res.status(201).json({
        success: true,
        message: "Daily attendance created",
        id: insertId,
      });
    } catch (e) {
      next(e);
    }
  },

  // ===== UPDATE =====
  async update(req, res, next) {
    try {
      const ok = await service.update(req.params.id, req.body);
      if (!ok) throw new ApiError(404, "Daily attendance not found");
      res.json({ success: true, message: "Daily attendance updated" });
    } catch (e) {
      next(e);
    }
  },

  // ===== DELETE =====
  async remove(req, res, next) {
    try {
      const ok = await service.remove(req.params.id);
      if (!ok) throw new ApiError(404, "Daily attendance not found");
      res.json({ success: true, message: "Daily attendance deleted" });
    } catch (e) {
      next(e);
    }
  },
};
