const ApiError = require("../utils/ApiError");
const service = require("../services/familyMember.service");

function validateCreate(body) {
  if (!body.employeeId) throw new ApiError(400, "employeeId is required");
  if (!body.name) throw new ApiError(400, "name is required");
  if (!body.relationship) throw new ApiError(400, "relationship is required");
}

module.exports = {
  // GET /api/family-members
  async list(req, res, next) {
    try {
      const result = await service.list(req.query, req.user);
      res.json({ success: true, data: result });
    } catch (e) {
      next(e);
    }
  },

  // GET /api/family-members/:id
  async getById(req, res, next) {
    try {
      const row = await service.getById(req.params.id, req.user);
      if (!row) throw new ApiError(404, "Family member not found");
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  // POST /api/family-members
  async create(req, res, next) {
    try {
      validateCreate(req.body);
      const created = await service.create(req.body, req.user);
      res.status(201).json({ success: true, data: created });
    } catch (e) {
      next(e);
    }
  },

  // PUT /api/family-members/:id
  async update(req, res, next) {
    try {
      const updated = await service.update(req.params.id, req.body, req.user);
      if (!updated) throw new ApiError(404, "Family member not found");
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  // DELETE /api/family-members/:id
  async remove(req, res, next) {
    try {
      const ok = await service.remove(req.params.id, req.user);
      if (!ok) throw new ApiError(404, "Family member not found");
      res.json({ success: true, message: "Deleted" });
    } catch (e) {
      next(e);
    }
  },
};
