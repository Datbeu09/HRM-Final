// backend/src/controllers/monthlyAttendance.controller.js
const service = require("../services/monthlyAttendance.service");
const ApiError = require("../utils/ApiError");

module.exports = {
  async list(req, res, next) {
    try {
      const rows = await service.list(req.query, req.user);
      res.json({ success: true, data: rows });
    } catch (e) {
      next(e);
    }
  },

  async getByEmployeeMonth(req, res, next) {
    try {
      const { employeeId, month, year } = req.query;
      if (!employeeId || !month || !year) {
        throw new ApiError(400, "employeeId, month, year are required");
      }
      const row = await service.getByEmployeeMonth({ employeeId, month, year }, req.user);
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  async ensure(req, res, next) {
    try {
      const { employeeId, month, year } = req.body;
      if (!employeeId || !month || !year) {
        throw new ApiError(400, "employeeId, month, year are required");
      }
      const row = await service.ensure({ employeeId, month, year }, req.user);
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  async submit(req, res, next) {
    try {
      const { id } = req.params;
      const row = await service.submit({ id }, req.user);
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  async approve(req, res, next) {
    try {
      const { id } = req.params;
      const row = await service.approve({ id }, req.user);
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  async reject(req, res, next) {
    try {
      const { id } = req.params;
      const { rejectReason } = req.body || {};
      const row = await service.reject({ id, rejectReason }, req.user);
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  async lock(req, res, next) {
    try {
      const { id } = req.params;
      const { locked } = req.body || {};
      const row = await service.lock({ id, locked }, req.user);
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },
};
