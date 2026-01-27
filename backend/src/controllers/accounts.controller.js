// src/controllers/accounts.controller.js
const ApiError = require("../utils/ApiError");
const service = require("../services/accounts.service");

module.exports = {
  // ================= LOGIN =================
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw new ApiError(400, "Username and password are required");
      }

      const account = await service.login(username, password);
      res.json({ success: true, data: account });
    } catch (e) {
      next(e);
    }
  },

  // ================= LIST =================
  async list(req, res, next) {
    try {
      const data = await service.list(req.query, req.user);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  // ================= GET BY ID =================
  async getById(req, res, next) {
    try {
      const row = await service.getById(req.params.id, req.user);
      if (!row) throw new ApiError(404, "Account not found");
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  // ================= CREATE =================
  async create(req, res, next) {
    try {
      const created = await service.create(req.body, req.user);
      res.status(201).json({ success: true, data: created });
    } catch (e) {
      next(e);
    }
  },

  // ================= UPDATE =================
  async update(req, res, next) {
    try {
      const updated = await service.update(req.params.id, req.body, req.user);
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  // ================= DELETE =================
  async remove(req, res, next) {
    try {
      await service.remove(req.params.id, req.user);
      res.json({ success: true, message: "Account deleted" });
    } catch (e) {
      next(e);
    }
  },
};
