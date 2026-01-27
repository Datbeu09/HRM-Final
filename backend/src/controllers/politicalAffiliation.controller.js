const ApiError = require("../utils/ApiError");
const service = require("../services/politicalAffiliation.service");

function validateCreate(body) {
  if (!body.employeeId) throw new ApiError(400, "employeeId is required");
  if (!body.youthUnionMembershipDate) throw new ApiError(400, "youthUnionMembershipDate is required");
  if (!body.partyMembershipDate) throw new ApiError(400, "partyMembershipDate is required");
  if (!body.partyStatus) throw new ApiError(400, "partyStatus is required");
}

module.exports = {
  async list(req, res, next) {
    try {
      const data = await service.list();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const row = await service.getById(req.params.id);
      if (!row) throw new ApiError(404, "Political affiliation not found");
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      validateCreate(req.body);
      const created = await service.create(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await service.update(req.params.id, req.body);
      if (!updated) throw new ApiError(404, "Political affiliation not found");
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      const ok = await service.remove(req.params.id);
      if (!ok) throw new ApiError(404, "Political affiliation not found");
      res.json({ success: true, message: "Deleted successfully" });
    } catch (e) {
      next(e);
    }
  }
};
