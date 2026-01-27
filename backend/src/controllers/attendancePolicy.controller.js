const ApiError = require("../utils/ApiError");
const service = require("../services/attendancePolicy.service");

/* ===== helpers ===== */
function isTime(v) {
  return typeof v === "string" &&
    /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(v);
}

function validateCreate(body) {
  if (!body.name) throw new ApiError(400, "name is required");

  const requiredTimes = ["checkInStart", "checkInEnd", "autoCheckOutAt"];
  for (const f of requiredTimes) {
    if (!isTime(body[f])) {
      throw new ApiError(400, `${f} must be HH:MM or HH:MM:SS`);
    }
  }

  const optionalTimes = ["checkOutStart", "checkOutEnd"];
  for (const f of optionalTimes) {
    if (body[f] !== undefined && body[f] !== null && body[f] !== "") {
      if (!isTime(body[f])) {
        throw new ApiError(400, `${f} must be HH:MM or HH:MM:SS`);
      }
    }
  }

  if (
    body.standardMinutes !== undefined &&
    (!Number.isFinite(Number(body.standardMinutes)) || body.standardMinutes <= 0)
  ) {
    throw new ApiError(400, "standardMinutes must be a positive number");
  }
}

function validateUpdate(body) {
  const timeFields = [
    "checkInStart",
    "checkInEnd",
    "checkOutStart",
    "checkOutEnd",
    "autoCheckOutAt",
  ];

  for (const f of timeFields) {
    if (body[f] !== undefined && body[f] !== null && body[f] !== "") {
      if (!isTime(body[f])) {
        throw new ApiError(400, `${f} must be HH:MM or HH:MM:SS`);
      }
    }
  }

  if (
    body.standardMinutes !== undefined &&
    (!Number.isFinite(Number(body.standardMinutes)) || body.standardMinutes <= 0)
  ) {
    throw new ApiError(400, "standardMinutes must be a positive number");
  }
}

/* ===== controller ===== */
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
      if (!row) throw new ApiError(404, "AttendancePolicy not found");
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
      validateUpdate(req.body);
      const updated = await service.update(req.params.id, req.body);
      if (!updated) throw new ApiError(404, "AttendancePolicy not found");
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      const ok = await service.remove(req.params.id);
      if (!ok) throw new ApiError(404, "AttendancePolicy not found");
      res.json({ success: true, message: "Deleted" });
    } catch (e) {
      next(e);
    }
  },
};
