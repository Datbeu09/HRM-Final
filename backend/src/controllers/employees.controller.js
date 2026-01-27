// src/controllers/employees.controller.js
const ApiError = require("../utils/ApiError");
const service = require("../services/employees.service");

// ===== helper =====
const isDateLike = (v) => !v || !Number.isNaN(Date.parse(v));

function validateCreate(body) {
  if (!body.employeeCode) throw new ApiError(400, "employeeCode is required");
  if (!body.name) throw new ApiError(400, "name is required");

  ["dob", "politicalPartyDate", "youthUnionDate", "startDate", "endDate"].forEach((k) => {
    if (!isDateLike(body[k])) throw new ApiError(400, `${k} is invalid date`);
  });

  if (body.familyInfo != null && Number(body.familyInfo) < 0) {
    throw new ApiError(400, "familyInfo must be >= 0");
  }
}

// ================= LIST =================
exports.listEmployees = async (req, res, next) => {
  try {
    const result = await service.list();
    res.json({ success: true, ...result });
  } catch (e) {
    next(e);
  }
};

// ================= GET BY ID =================
exports.getEmployeeById = async (req, res, next) => {
  try {
    const emp = await service.getById(req.params.id);
    if (!emp) throw new ApiError(404, "Employee not found");
    res.json({ success: true, data: emp });
  } catch (e) {
    next(e);
  }
};

// ================= CREATE =================
exports.createEmployee = async (req, res, next) => {
  try {
    validateCreate(req.body);

    // mặc định tạo account
    const createAccount = req.body.createAccount !== false;

    const created = await service.create(req.body, { createAccount });
    res.status(201).json({ success: true, data: created });
  } catch (e) {
    next(e);
  }
};

// ================= BULK CREATE =================
exports.bulkCreateEmployees = async (req, res, next) => {
  try {
    // hỗ trợ 2 dạng:
    // 1) body là array: [ {...}, {...} ]
    // 2) body object: { employees: [ ... ], createAccount: true/false }
    const employees = Array.isArray(req.body) ? req.body : req.body?.employees;

    if (!Array.isArray(employees) || employees.length === 0) {
      throw new ApiError(400, "employees must be a non-empty array");
    }

    // mặc định tạo account cho tất cả, trừ khi item.createAccount === false
    const defaultCreateAccount =
      Array.isArray(req.body) ? true : req.body?.createAccount !== false;

    employees.forEach((emp) => validateCreate(emp));

    const result = await service.bulkCreate(employees, {
      defaultCreateAccount,
    });

    res.status(201).json({ success: true, ...result });
  } catch (e) {
    next(e);
  }
};

// ================= UPDATE =================
exports.updateEmployee = async (req, res, next) => {
  try {
    ["dob", "politicalPartyDate", "youthUnionDate", "startDate", "endDate"].forEach((k) => {
      if (!isDateLike(req.body[k])) throw new ApiError(400, `${k} is invalid date`);
    });

    if (req.body.familyInfo != null && Number(req.body.familyInfo) < 0) {
      throw new ApiError(400, "familyInfo must be >= 0");
    }

    const updated = await service.update(req.params.id, req.body);
    if (!updated) throw new ApiError(404, "Employee not found");

    res.json({ success: true, data: updated });
  } catch (e) {
    next(e);
  }
};

// ================= DELETE =================
exports.deleteEmployee = async (req, res, next) => {
  try {
    const ok = await service.remove(req.params.id);
    if (!ok) throw new ApiError(404, "Employee not found");
    res.json({ success: true, message: "Deleted" });
  } catch (e) {
    next(e);
  }
};
