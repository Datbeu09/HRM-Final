// src/controllers/payrollDetail.controller.js
const ApiError = require("../utils/ApiError");
const service = require("../services/payrollDetail.service");

module.exports = {
  async getDetail(req, res, next) {
    try {
      const { employeeId } = req.params;
      const { month } = req.query;

      if (!employeeId) throw new ApiError(400, "employeeId is required");
      if (!month) throw new ApiError(400, "month is required (YYYY-MM)");

      const data = await service.getPayrollDetail({
        employeeId: Number(employeeId),
        monthStr: month,
      });

      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },
};
