// src/services/employees.service.js
const pool = require("../config/db");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

const FIELDS = [
  "employeeCode",
  "name",
  "title",
  "position",
  "department",
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
];

function genUsernameFromEmployeeCode(employeeCode) {
  return String(employeeCode || "").trim().toLowerCase();
}

// policyId: tránh FK fail khi client gửi 0
function normalizePolicyId(v) {
  if (v === undefined || v === null) return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function makeEmployeeCodeFromId(id) {
  // NV001, NV002... NV1234 => NV1234 (bạn có thể pad 4 số nếu muốn)
  return `NV${String(id).padStart(3, "0")}`;
}

module.exports = {
  async list() {
    const [rows] = await pool.query("SELECT * FROM employees");
    return {
      data: rows,
      paging: { page: 1, limit: rows.length, total: rows.length, totalPages: 1 },
    };
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM employees WHERE id = ?", [id]);
    return rows[0] || null;
  },

  // ✅ CREATE (employee + optional account) - employeeCode do backend tự generate
  async create(body, opts = { createAccount: true }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const now = new Date();

      // 1) build payload (KHÔNG cần employeeCode từ client)
      const payload = {};
      FIELDS.forEach((f) => {
        if (body[f] !== undefined) payload[f] = body[f];
      });

      // ép policyId chuẩn
      payload.policyId = normalizePolicyId(payload.policyId);

      // nếu client có gửi employeeCode thì vẫn cho (nhưng phải unique)
      if (payload.employeeCode) {
        const [exists] = await conn.query(
          "SELECT id FROM employees WHERE employeeCode = ? LIMIT 1",
          [payload.employeeCode]
        );
        if (exists.length) throw new ApiError(409, "employeeCode already exists");
      }

      payload.createdAt = now;
      payload.updatedAt = now;

      // 2) insert employee
      const columns = Object.keys(payload);
      const values = Object.values(payload);
      const placeholders = columns.map(() => "?").join(",");

      const [result] = await conn.query(
        `INSERT INTO employees (${columns.join(",")}) VALUES (${placeholders})`,
        values
      );

      const employeeId = result.insertId;

      // 3) nếu chưa có employeeCode => generate từ id và update lại
      let employeeCode = payload.employeeCode;
      if (!employeeCode) {
        employeeCode = makeEmployeeCodeFromId(employeeId);

        // đảm bảo unique (thực tế sẽ unique vì id unique, nhưng vẫn safe)
        await conn.query(
          `UPDATE employees SET employeeCode = ? WHERE id = ?`,
          [employeeCode, employeeId]
        );
      }

      // 4) optional create account (username = employeeCode)
      if (opts.createAccount) {
        const username = genUsernameFromEmployeeCode(employeeCode);
        if (!username) throw new ApiError(400, "Cannot generate username from employeeCode");

        const [uRows] = await conn.query(
          "SELECT id FROM accounts WHERE username = ? LIMIT 1",
          [username]
        );
        if (uRows.length) throw new ApiError(409, "Username already exists");

        const rawPassword = String(
          body.accountPassword || process.env.DEFAULT_PASSWORD || "123456"
        );
        const hashedPassword = await bcrypt.hash(rawPassword, 12);

        // ⚠️ Nếu DB của bạn đang UNIQUE accounts.name thì sẽ lỗi khi trùng tên.
        // => Fix tốt nhất: bỏ unique ở accounts.name hoặc đổi unique sang username.
        await conn.query(
          `
          INSERT INTO accounts
          (username, password, employeeId, name, role, status, lastLoginAt, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)
          `,
          [
            username,
            hashedPassword,
            employeeId,
            body.name,
            body.position || "EMPLOYEE",
            "Hoạt động",
            now,
            now,
          ]
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

  async update(id, body) {
    const current = await this.getById(id);
    if (!current) return null;

    const patch = {};
    FIELDS.forEach((f) => {
      if (body[f] !== undefined) patch[f] = body[f];
    });

    if (patch.policyId !== undefined) patch.policyId = normalizePolicyId(patch.policyId);

    // ✅ nếu update employeeCode thì check unique
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

  // src/services/employees.service.js
  async remove(id) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1) ensure employee exists
      const [eRows] = await conn.query(
        "SELECT id FROM employees WHERE id = ? LIMIT 1",
        [id]
      );
      if (!eRows.length) {
        await conn.rollback();
        return false;
      }

      // 2) find ALL child tables referencing employees(id)
      const [fkRows] = await conn.query(
        `
      SELECT
        kcu.TABLE_NAME as tableName,
        kcu.COLUMN_NAME as columnName,
        kcu.CONSTRAINT_NAME as constraintName
      FROM information_schema.KEY_COLUMN_USAGE kcu
      WHERE kcu.REFERENCED_TABLE_SCHEMA = DATABASE()
        AND kcu.REFERENCED_TABLE_NAME = 'employees'
        AND kcu.REFERENCED_COLUMN_NAME = 'id'
      `,
        []
      );

      // 3) delete children first (avoid FK block)
      //    IMPORTANT: delete from child tables BEFORE employees
      for (const r of fkRows) {
        const table = String(r.tableName || "");
        const col = String(r.columnName || "");

        // safety: only allow simple identifiers
        if (!/^[a-zA-Z0-9_]+$/.test(table) || !/^[a-zA-Z0-9_]+$/.test(col)) continue;

        // Do NOT delete employees here
        if (table === "employees") continue;

        // Delete rows referencing this employee
        await conn.query(`DELETE FROM \`${table}\` WHERE \`${col}\` = ?`, [id]);
      }

      // 4) delete employee
      const [result] = await conn.query("DELETE FROM employees WHERE id = ?", [id]);

      await conn.commit();
      return result.affectedRows > 0;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

};
