const ApiError = require("../utils/ApiError");
const service = require("../services/workAssignments.service");

function validateCreate(body) {
  if (!body.employeeId) throw new ApiError(400, "employeeId is required");
  if (!body.taskName) throw new ApiError(400, "taskName is required");
  if (!body.assignedDate) throw new ApiError(400, "assignedDate is required");
}

module.exports = {
  // GET /work-assignments
  async getAllWorkAssignments(req, res, next) {
    try {
      const data = await service.getAll(req.query);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  // GET /work-assignments/:id
  async getWorkAssignmentById(req, res, next) {
    try {
      const row = await service.getById(req.params.id);
      if (!row) throw new ApiError(404, "WorkAssignment not found");
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  // POST /work-assignments
  async createWorkAssignment(req, res, next) {
    try {
      validateCreate(req.body);
      const created = await service.create(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (e) {
      next(e);
    }
  },

  // PUT /work-assignments/:id
  async updateWorkAssignment(req, res, next) {
    try {
      const updated = await service.update(req.params.id, req.body);
      if (!updated) throw new ApiError(404, "WorkAssignment not found");
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  // DELETE /work-assignments/:id
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
