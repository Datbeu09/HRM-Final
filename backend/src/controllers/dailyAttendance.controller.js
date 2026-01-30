const ApiError = require("../utils/ApiError");
const service = require("../services/dailyAttendance.service");

module.exports = {
  async getByEmployeeMonth(req, res, next) {
    try {
      const { employeeId, month, year } = req.query;
      if (!employeeId || !month || !year) throw new ApiError(400, "employeeId, month, year are required");

      const rows = await service.getByEmployeeMonth({
        employeeId: Number(employeeId),
        month: Number(month),
        year: Number(year),
      });

      res.json({ success: true, data: rows });
    } catch (e) {
      next(e);
    }
  },

  async upsert(req, res, next) {
    try {
      const {
        employeeId,
        date,
        status,
        hoursWorked,
        overtimeHours,
        notes,
      } = req.body;

      if (!employeeId || !date) throw new ApiError(400, "employeeId and date are required");

      const row = await service.upsert({
        employeeId: Number(employeeId),
        date: String(date).slice(0, 10), // YYYY-MM-DD
        status: status || "PRESENT",
        hoursWorked: Number(hoursWorked || 0),
        overtimeHours: Number(overtimeHours || 0),
        notes: notes || "",
        accountId: req.user?.id || null,
      });

      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },
};
