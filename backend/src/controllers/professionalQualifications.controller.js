const ApiError = require("../utils/ApiError");
const service = require("../services/professionalQualification.service");

function validateCreate(body, user) {
  if (user.role !== "EMPLOYEE" && !body.employeeId) {
    throw new ApiError(400, "employeeId is required");
  }
  if (!body.degree) throw new ApiError(400, "degree is required");
  if (!body.fieldOfStudy) throw new ApiError(400, "fieldOfStudy is required");
  if (!body.educationLevel) throw new ApiError(400, "educationLevel is required");
  if (!body.institution) throw new ApiError(400, "institution is required");
  if (!body.graduationYear) throw new ApiError(400, "graduationYear is required");
}

module.exports = {
  // GET /professional-qualifications
  async getAll(req, res, next) {
    try {
      const data = await service.getAll(req.query, req.user);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  // GET /professional-qualifications/:id
  async getById(req, res, next) {
    try {
      const row = await service.getById(req.params.id, req.user);
      if (!row) throw new ApiError(404, "Not found");
      res.json({ success: true, data: row });
    } catch (e) {
      next(e);
    }
  },

  // POST /professional-qualifications
  async create(req, res, next) {
    try {
      validateCreate(req.body, req.user);
      const created = await service.create(req.body, req.user);
      res.status(201).json({ success: true, data: created });
    } catch (e) {
      next(e);
    }
  },

  // PUT /professional-qualifications/:id
  async update(req, res, next) {
    try {
      const updated = await service.update(req.params.id, req.body, req.user);
      if (!updated) throw new ApiError(404, "Not found");
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  // DELETE /professional-qualifications/:id
  async remove(req, res, next) {
    try {
      const ok = await service.remove(req.params.id, req.user);
      if (!ok) throw new ApiError(404, "Not found");
      res.json({ success: true, message: "Deleted" });
    } catch (e) {
      next(e);
    }
  },
};
