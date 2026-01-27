const workHistoryService = require("../services/workHistory.service");
const ApiError = require("../utils/ApiError");

module.exports = {
  // GET /api/work-histories
  async getAllWorkHistories(req, res, next) {
    try {
      const rows = await workHistoryService.getAllWorkHistories();
      res.json({ success: true, data: rows });
    } catch (err) {
      console.error(err);
      next(new ApiError(500, "Failed to fetch work histories"));
    }
  },

  // GET /api/work-histories/employee/:employeeId
  async getWorkHistoryByEmployeeId(req, res, next) {
    try {
      const { employeeId } = req.params;
      const rows = await workHistoryService.getWorkHistoryByEmployeeId(employeeId);
      res.json({ success: true, data: rows });
    } catch (err) {
      console.error(err);
      next(new ApiError(500, "Failed to fetch work history by employee"));
    }
  },

  // GET /api/work-histories/:id
  async getWorkHistoryById(req, res, next) {
    try {
      const row = await workHistoryService.getWorkHistoryById(req.params.id);
      if (!row) return next(new ApiError(404, "Work history not found"));
      res.json({ success: true, data: row });
    } catch (err) {
      console.error(err);
      next(new ApiError(500, "Failed to fetch work history"));
    }
  },

  // POST /api/work-histories
  async addWorkHistory(req, res, next) {
    try {
      const insertId = await workHistoryService.addWorkHistory(req.body);
      res.status(201).json({ success: true, insertId });
    } catch (err) {
      console.error(err);
      next(new ApiError(500, "Failed to create work history"));
    }
  },

  // PUT /api/work-histories/:id
  async updateWorkHistory(req, res, next) {
    try {
      const affected = await workHistoryService.updateWorkHistory(
        req.params.id,
        req.body
      );
      if (!affected) return next(new ApiError(404, "Work history not found"));
      res.json({ success: true, message: "Updated successfully" });
    } catch (err) {
      console.error(err);
      next(new ApiError(500, "Failed to update work history"));
    }
  },

  // DELETE /api/work-histories/:id
  async deleteWorkHistory(req, res, next) {
    try {
      const affected = await workHistoryService.deleteWorkHistory(req.params.id);
      if (!affected) return next(new ApiError(404, "Work history not found"));
      res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      console.error(err);
      next(new ApiError(500, "Failed to delete work history"));
    }
  },
};
