const ApiError = require("../utils/ApiError");
const service = require("../services/departments.service");

/* ===== VALIDATION ===== */
function validateCreate(body) {
  if (!body.departmentName) {
    throw new ApiError(400, "departmentName is required");
  }
  if (body.departmentCode !== undefined && body.departmentCode === "") {
    throw new ApiError(400, "departmentCode cannot be empty");
  }
}

function validateUpdate(body) {
  if (body.departmentName !== undefined && body.departmentName === "") {
    throw new ApiError(400, "departmentName cannot be empty");
  }
  if (body.departmentCode !== undefined && body.departmentCode === "") {
    throw new ApiError(400, "departmentCode cannot be empty");
  }
}

/* ===== CONTROLLER ===== */
module.exports = {
  // GET /api/departments
  async list(req, res, next) {
    try {
      const result = await service.list(req.query);
      res.json({ success: true, ...result });
    } catch (e) {
      next(e);
    }
  },

  // GET /api/departments/:id
  async getById(req, res, next) {
    try {
      const row = await service.getById(req.params.id);
      if (!row) throw new ApiError(404, "Department not found");
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  // POST /api/departments
  async create(req, res, next) {
    try {
      validateCreate(req.body);
      const created = await service.create(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (e) {
      next(e);
    }
  },

  // PUT /api/departments/:id
  async update(req, res, next) {
    try {
      validateUpdate(req.body);
      const updated = await service.update(req.params.id, req.body);
      if (!updated) throw new ApiError(404, "Department not found");
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  // DELETE /api/departments/:id
  async remove(req, res, next) {
    try {
      const ok = await service.remove(req.params.id);
      if (!ok) throw new ApiError(404, "Department not found");
      res.json({ success: true, message: "Deleted successfully" });
    } catch (e) {
      next(e);
    }
  }
};
