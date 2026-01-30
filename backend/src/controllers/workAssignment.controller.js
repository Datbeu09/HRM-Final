const ApiError = require("../utils/ApiError");
const service = require("../services/workAssignments.service");

function validateCreate(body) {
  if (!body.employeeId) throw new ApiError(400, "employeeId is required");
  if (!body.assignedDate) throw new ApiError(400, "assignedDate is required");
  if (!body.taskId && !body.taskName) throw new ApiError(400, "taskId or taskName is required");
}

module.exports = {
  // GET /workAssignments
  async getAllWorkAssignments(req, res, next) {
    try {
      const data = await service.getAll(req.query);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  // GET /workAssignments/:id
  async getWorkAssignmentById(req, res, next) {
    try {
      const row = await service.getById(req.params.id);
      if (!row) throw new ApiError(404, "WorkAssignment not found");
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  // POST /workAssignments
  async createWorkAssignment(req, res, next) {
    try {
      validateCreate(req.body);

      // ưu tiên lấy từ token nếu có (admin tạo assignment)
      const assignedByAccountId =
        req.body.assignedByAccountId ?? req.user?.id ?? null;

      const created = await service.create({
        ...req.body,
        assignedByAccountId,
      });

      res.status(201).json({ success: true, data: created });
    } catch (e) {
      next(e);
    }
  },

  // PUT /workAssignments/:id
  async updateWorkAssignment(req, res, next) {
    try {
      const assignedByAccountId =
        req.body.assignedByAccountId ?? req.user?.id ?? undefined;

      const updated = await service.update(req.params.id, {
        ...req.body,
        ...(assignedByAccountId !== undefined ? { assignedByAccountId } : {}),
      });

      if (!updated) throw new ApiError(404, "WorkAssignment not found");
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  // DELETE /workAssignments/:id
  async deleteWorkAssignment(req, res, next) {
    try {
      const ok = await service.remove(req.params.id);
      if (!ok) throw new ApiError(404, "WorkAssignment not found");
      res.json({ success: true, message: "Deleted" });
    } catch (e) {
      next(e);
    }
  },
};
