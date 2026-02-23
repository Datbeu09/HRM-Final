// src/controllers/approvals.controller.js
const ApiError = require("../utils/ApiError");
const service = require("../services/approvals.service");

function validateCreate(body) {
  if (!body.type) throw new ApiError(400, "type is required");
  if (!body.reason) throw new ApiError(400, "reason is required");
  if (!body.startDate) throw new ApiError(400, "startDate is required");
  if (!body.endDate) throw new ApiError(400, "endDate is required");
}

// ✅ helper check permission
function hasPerm(user, perm) {
  const perms = user?.permissions || [];
  return perms.includes(perm);
}

module.exports = {
  // =========================
  // ADMIN/APPROVER
  // =========================
  async list(req, res, next) {
    try {
      const data = await service.list(req.query, req.user);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const row = await service.getById(req.params.id, req.user);
      if (!row) throw new ApiError(404, "Approval not found");
      res.json({ success: true, data: row });
    } catch (err) {
      next(err);
    }
  },

  // =========================
  // EMPLOYEE LIST (self) + APPROVER LIST (any)
  // =========================
  async getByEmployeeId(req, res, next) {
    try {
      const employeeId = Number(req.params.employeeId);
      if (!employeeId) throw new ApiError(400, "employeeId is invalid");

      const isApprover = hasPerm(req.user, "REQUEST_APPROVE");
      const myEmployeeId = Number(req.user?.employeeId);

      // ✅ NV/KT chỉ được xem đơn của chính mình
      if (!isApprover && employeeId !== myEmployeeId) {
        throw new ApiError(403, "Forbidden");
      }

      // ⚠️ service cần có hàm này:
      // getByEmployeeId(employeeId, query, user)
      const data = await service.getByEmployeeId(employeeId, req.query, req.user);

      // ✅ luôn trả [] thay vì 404
      res.json({ success: true, data: Array.isArray(data) ? data : [] });
    } catch (err) {
      next(err);
    }
  },

  // =========================
  // CREATE
  // =========================
  async create(req, res, next) {
    try {
      validateCreate(req.body);

      const isApprover = hasPerm(req.user, "REQUEST_APPROVE");
      const myEmployeeId = Number(req.user?.employeeId);

      // ✅ Payload base
      const payload = { ...req.body };

      // ✅ NV/KT: chỉ được tạo cho chính mình (không cho set employeeId khác)
      if (!isApprover) {
        if (!myEmployeeId) throw new ApiError(400, "user.employeeId is missing");
        payload.employeeId = myEmployeeId;
      } else {
        // ✅ HR/DIR/ADMIN: có thể tạo hộ, nếu không gửi employeeId thì mặc định là bản thân
        payload.employeeId = payload.employeeId ?? myEmployeeId;
      }

      const data = await service.create(payload, req.user);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  // =========================
  // UPDATE / DELETE (thường chỉ approver)
  // =========================
  async update(req, res, next) {
    try {
      const data = await service.update(req.params.id, req.body, req.user);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await service.remove(req.params.id, req.user);
      res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      next(err);
    }
  },

  // =========================
  // APPROVE / REJECT
  // =========================
  async approve(req, res, next) {
    try {
      const data = await service.approve(req.params.id, req.body, req.user);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async reject(req, res, next) {
    try {
      const data = await service.reject(req.params.id, req.body, req.user);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};