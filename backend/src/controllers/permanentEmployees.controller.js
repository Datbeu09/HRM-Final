const ApiError = require("../utils/ApiError");
const service = require("../services/permanentEmployees.service");

function validateCreate(body) {
  if (!body.employeeId) throw new ApiError(400, "employeeId is required");
  if (!body.salaryLevelId) throw new ApiError(400, "salaryLevelId is required");
  if (body.applicableRate === undefined)
    throw new ApiError(400, "applicableRate is required");
}

module.exports = {
  // GET /permanent-employees
  async getAll(req, res, next) {
    try {
      const rows = await service.getAll();
      res.json({ success: true, data: rows });
    } catch (e) {
      next(e);
    }
  },

  // GET /permanent-employees/:employeeId
  async getByEmployeeId(req, res, next) {
    try {
      const row = await service.getByEmployeeId(req.params.employeeId);
      if (!row) throw new ApiError(404, "Permanent employee not found");
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  // POST /permanent-employees
  async create(req, res, next) {
    try {
      validateCreate(req.body);
      const created = await service.create(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (e) {
      next(e);
    }
  },

  // PUT /permanent-employees/:employeeId
  async update(req, res, next) {
    try {
      const updated = await service.update(
        req.params.employeeId,
        req.body
      );
      if (!updated) throw new ApiError(404, "Permanent employee not found");
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  // DELETE /permanent-employees/:employeeId
  async remove(req, res, next) {
    try {
      const ok = await service.remove(req.params.employeeId);
      if (!ok) throw new ApiError(404, "Permanent employee not found");
      res.json({ success: true, message: "Deleted" });
    } catch (e) {
      next(e);
    }
  }
};
