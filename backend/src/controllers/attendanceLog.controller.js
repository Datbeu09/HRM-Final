// src/controllers/attendanceLog.controller.js
const service = require("../services/attendanceLog.service");
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
      if (!row) throw new ApiError(404, "Attendance log not found");
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  // ===== GET BY EMPLOYEE + DATE =====
  async getByEmployeeAndDate(req, res, next) {
    try {
      const { employeeId, workDate } = req.params;
      const rows = await service.getByEmployeeAndDate(employeeId, workDate);
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
        message: "Attendance log created",
        id: insertId,
      });
    } catch (e) {
      next(e);
    }
  },

  // ===== UPDATE =====
  async update(req, res, next) {
    try {
      const updated = await service.update(req.params.id, req.body);
      if (!updated) throw new ApiError(404, "Attendance log not found");
      res.json({ success: true, message: "Attendance log updated" });
    } catch (e) {
      next(e);
    }
  },

  // ===== DELETE =====
  async remove(req, res, next) {
    try {
      const deleted = await service.remove(req.params.id);
      if (!deleted) throw new ApiError(404, "Attendance log not found");
      res.json({ success: true, message: "Attendance log deleted" });
    } catch (e) {
      next(e);
    }
  },
};
