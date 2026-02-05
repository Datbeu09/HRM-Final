const pool = require("../config/db");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

const FIELDS = [
  "employeeCode",
  "name",
  "title",
  "position",
  "departmentId",
  "status",
  "dob",
  "gender",
  "address",
  "phone",
  "email",
  "education",
  "politicalStatus",
  "politicalPartyDate",
  "youthUnionMember",
  "youthUnionDate",
  "policyStatus",
  "contractType",
  "startDate",
  "endDate",
  "workStatus",
  "familyInfo",
  "policyId",
  "createdAt",
  "updatedAt",
];

function genUsernameFromEmployeeCode(employeeCode) {
  return String(employeeCode || "").trim().toLowerCase();
}

function normalizePolicyId(v) {
  if (v === undefined || v === null) return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function normalizeDepartmentId(v) {
  if (v === undefined || v === null) return null;
  if (typeof v === "object") return null;
  const n = Number(String(v).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function makeEmployeeCodeFromId(id) {
  return `NV${String(id).padStart(3, "0")}`;
}

module.exports = {
  // ================= LIST =================
  async list() {
    const [rows] = await pool.query(
      "SELECT id, employeeCode, name, title, position, departmentId, status, dob, gender, address, phone, email, education, politicalStatus, politicalPartyDate, youthUnionMember, youthUnionDate, policyStatus, contractType, startDate, endDate, workStatus, familyInfo, policyId, createdAt, updatedAt FROM employees"
    );
    return {
      data: rows,
      paging: { page: 1, limit: rows.length, total: rows.length, totalPages: 1 },
    };
  },

  // ================= GET BY ID =================
  async getById(id) {
    const [rows] = await pool.query(
      "SELECT id, employeeCode, name, title, position, departmentId, status, dob, gender, address, phone, email, education, politicalStatus, politicalPartyDate, youthUnionMember, youthUnionDate, policyStatus, contractType, startDate, endDate, workStatus, familyInfo, policyId, createdAt, updatedAt FROM employees WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  // ================= CREATE =================
  async create(body, opts = { createAccount: true }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const now = new Date();

      const payload = {};
      FIELDS.forEach((f) => {
        if (body[f] !== undefined) payload[f] = body[f];
      });

      // ✅ normalize & validate departmentId
      payload.departmentId = normalizeDepartmentId(payload.departmentId);
      if (!payload.departmentId) throw new ApiError(400, "departmentId is required");

      payload.policyId = normalizePolicyId(payload.policyId);

      // Kiểm tra nếu mã nhân viên đã tồn tại
      if (payload.employeeCode) {
        const [exists] = await conn.query(
          "SELECT id FROM employees WHERE employeeCode = ? LIMIT 1",
          [payload.employeeCode]
        );
        if (exists.length) throw new ApiError(409, "employeeCode already exists");
      }

      payload.createdAt = now;
      payload.updatedAt = now;

      const columns = Object.keys(payload);
      const values = Object.values(payload);
      const placeholders = columns.map(() => "?").join(",");

      const [result] = await conn.query(
        `INSERT INTO employees (${columns.join(",")}) VALUES (${placeholders})`,
        values
      );

      const employeeId = result.insertId;

      let employeeCode = payload.employeeCode;
      if (!employeeCode) {
        employeeCode = makeEmployeeCodeFromId(employeeId);
        await conn.query(`UPDATE employees SET employeeCode = ? WHERE id = ?`, [
          employeeCode,
          employeeId,
        ]);
      }

      // Tạo tài khoản nếu cần
      if (opts.createAccount) {
        const username = genUsernameFromEmployeeCode(employeeCode);
        if (!username) throw new ApiError(400, "Cannot generate username from employeeCode");

        const [uRows] = await conn.query(
          "SELECT id FROM accounts WHERE username = ? LIMIT 1",
          [username]
        );
        if (uRows.length) throw new ApiError(409, "Username already exists");

        const rawPassword = String(body.accountPassword || process.env.DEFAULT_PASSWORD || "123456");
        const hashedPassword = await bcrypt.hash(rawPassword, 12);

        await conn.query(
          `INSERT INTO accounts (username, password, employeeId, name, role, status, lastLoginAt, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
          [username, hashedPassword, employeeId, body.name, body.position || "EMPLOYEE", "Hoạt động", now, now]
        );
      }

      await conn.commit();

      const [rows] = await pool.query("SELECT * FROM employees WHERE id = ?", [employeeId]);
      return rows[0] || null;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  },

  // ================= UPDATE =================
  async update(id, body) {
    const current = await this.getById(id);
    if (!current) return null;

    const patch = {};

    // ✅ normalize & validate departmentId
    const depId = normalizeDepartmentId(body.departmentId);
    if (!depId) throw new ApiError(400, "departmentId is required");
    patch.departmentId = depId;

    // merge các field khác
    FIELDS.forEach((f) => {
      if (body[f] !== undefined) patch[f] = body[f];
    });

    // đảm bảo patch.departmentId không bị overwrite lại bởi body cũ (nếu body.departmentId là string)
    patch.departmentId = depId;

    if (patch.policyId !== undefined) patch.policyId = normalizePolicyId(patch.policyId);

    if (patch.employeeCode && patch.employeeCode !== current.employeeCode) {
      const [exists] = await pool.query(
        "SELECT id FROM employees WHERE employeeCode = ? AND id <> ? LIMIT 1",
        [patch.employeeCode, id]
      );
      if (exists.length) throw new ApiError(409, "employeeCode already exists");
    }

    patch.updatedAt = new Date();

    const columns = Object.keys(patch);
    if (!columns.length) return current;

    const sets = columns.map((c) => `${c} = ?`).join(", ");
    const values = [...Object.values(patch), id];

    await pool.query(`UPDATE employees SET ${sets} WHERE id = ?`, values);
    return this.getById(id);
  },

  // ================= DELETE =================
  async remove(id) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [eRows] = await conn.query("SELECT id FROM employees WHERE id = ? LIMIT 1", [id]);
      if (!eRows.length) {
        await conn.rollback();
        return false;
      }

      const [fkRows] = await conn.query(
        `SELECT kcu.TABLE_NAME as tableName, kcu.COLUMN_NAME as columnName, kcu.CONSTRAINT_NAME as constraintName
         FROM information_schema.KEY_COLUMN_USAGE kcu
         WHERE kcu.REFERENCED_TABLE_SCHEMA = DATABASE()
           AND kcu.REFERENCED_TABLE_NAME = 'employees'
           AND kcu.REFERENCED_COLUMN_NAME = 'id'`
      );

      for (const r of fkRows) {
        const table = String(r.tableName || "");
        const col = String(r.columnName || "");

        if (!/^[a-zA-Z0-9_]+$/.test(table) || !/^[a-zA-Z0-9_]+$/.test(col)) continue;
        if (table === "employees") continue;

        await conn.query(`DELETE FROM \`${table}\` WHERE \`${col}\` = ?`, [id]);
      }

      const [result] = await conn.query("DELETE FROM employees WHERE id = ?", [id]);

      await conn.commit();
      return result.affectedRows > 0;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  },
};