const ApiError = require("../utils/ApiError");
const service = require("../services/permissions.service");

module.exports = {
  async getAll(req, res, next) {
    try {
      const data = await service.getAll();
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const item = await service.getById(req.params.id);
      if (!item) throw new ApiError(404, "Permission not found");
      res.json({ success: true, data: item });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const { code, description } = req.body;
      if (!code) throw new ApiError(400, "code is required");

      const data = await service.create({ code, description });
      res.status(201).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const data = await service.update(req.params.id, req.body);
      if (!data) throw new ApiError(404, "Permission not found");
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      const ok = await service.remove(req.params.id);
      if (!ok) throw new ApiError(404, "Permission not found");
      res.json({ success: true, message: "Deleted successfully" });
    } catch (e) {
      next(e);
    }
  }
};
