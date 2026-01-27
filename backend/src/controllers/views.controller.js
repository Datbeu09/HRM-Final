const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response");
const { pool } = require("../config/db");

const employeesWithFamily = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM vw_employees_with_family ORDER BY id DESC");
  return ok(res, rows);
});

const employeeFamilyRows = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM vw_employee_family_rows ORDER BY employeeId DESC");
  return ok(res, rows);
});

module.exports = { employeesWithFamily, employeeFamilyRows };
