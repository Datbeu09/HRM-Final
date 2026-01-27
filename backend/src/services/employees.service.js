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
  "email", // vẫn giữ field này vì DB có, nhưng KHÔNG bắt/không sync nữa
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
  return String(employeeCode || "").trim().toLowerCase(); // NV020 -> nv020
}

// policyId: tránh FK fail khi client gửi 0
function normalizePolicyId(v) {
  if (v === undefined || v === null) return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
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

  // =========================
  // CREATE (employee + optional account)
  // =========================
  async create(body, opts = { createAccount: true }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1) employeeCode unique
      const [exists] = await conn.query(
        "SELECT id FROM employees WHERE employeeCode = ? LIMIT 1",
        [body.employeeCode]
      );
      if (exists.length) throw new ApiError(409, "employeeCode already exists");

      const now = new Date();

      // 2) build payload
      const payload = {};
      FIELDS.forEach((f) => {
        if (body[f] !== undefined) payload[f] = body[f];
      });

      payload.policyId = normalizePolicyId(payload.policyId);

      payload.createdAt = now;
      payload.updatedAt = now;

      const columns = Object.keys(payload);
      const values = Object.values(payload);
      const placeholders = columns.map(() => "?").join(",");

      // 3) insert employee
      const [result] = await conn.query(
        `INSERT INTO employees (${columns.join(",")}) VALUES (${placeholders})`,
        values
      );

      const employeeId = result.insertId;

      // 4) optional create account (username = employeeCode)
      if (opts.createAccount) {
        const username = genUsernameFromEmployeeCode(body.employeeCode);
        if (!username) throw new ApiError(400, "Cannot generate username from employeeCode");

        // username unique
        const [uRows] = await conn.query(
          "SELECT id FROM accounts WHERE username = ? LIMIT 1",
          [username]
        );
        if (uRows.length) throw new ApiError(409, "Username already exists");

        // password: body.accountPassword > env DEFAULT_PASSWORD > "123456"
        const rawPassword = String(
          body.accountPassword || process.env.DEFAULT_PASSWORD || "123456"
        );
        const hashedPassword = await bcrypt.hash(rawPassword, 12);

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

  // =========================
  // BULK CREATE (employees[] + optional accounts)
  // =========================
  async bulkCreate(employees = [], opts = { defaultCreateAccount: true }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const now = new Date();
      const createdIds = [];

      for (const body of employees) {
        // employeeCode unique
        const [exists] = await conn.query(
          "SELECT id FROM employees WHERE employeeCode = ? LIMIT 1",
          [body.employeeCode]
        );
        if (exists.length)
          throw new ApiError(409, `employeeCode already exists: ${body.employeeCode}`);

        // build payload
        const payload = {};
        if (body.id !== undefined && body.id !== null) payload.id = body.id;

        FIELDS.forEach((f) => {
          if (body[f] !== undefined) payload[f] = body[f];
        });

        payload.policyId = normalizePolicyId(payload.policyId);

        payload.createdAt = now;
        payload.updatedAt = now;

        const columns = Object.keys(payload);
        const values = Object.values(payload);
        const placeholders = columns.map(() => "?").join(",");

        const [result] = await conn.query(
          `INSERT INTO employees (${columns.join(",")}) VALUES (${placeholders})`,
          values
        );

        const employeeId = payload.id ?? result.insertId;
        createdIds.push(employeeId);

        const createAccount =
          body.createAccount === false ? false : opts.defaultCreateAccount !== false;

        if (createAccount) {
          const username = genUsernameFromEmployeeCode(body.employeeCode);
          if (!username) throw new ApiError(400, "Cannot generate username from employeeCode");

          const [uRows] = await conn.query(
            "SELECT id FROM accounts WHERE username = ? LIMIT 1",
            [username]
          );
          if (uRows.length) throw new ApiError(409, `Username already exists: ${username}`);

          const rawPassword = String(
            body.accountPassword || process.env.DEFAULT_PASSWORD || "123456"
          );
          const hashedPassword = await bcrypt.hash(rawPassword, 12);

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
      }

      await conn.commit();

      const [rows] = await pool.query(
        `SELECT * FROM employees WHERE id IN (${createdIds.map(() => "?").join(",")}) ORDER BY id ASC`,
        createdIds
      );

      return { count: createdIds.length, data: rows };
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

    patch.updatedAt = new Date();

    const columns = Object.keys(patch);
    if (!columns.length) return current;

    const sets = columns.map((c) => `${c} = ?`).join(", ");
    const values = [...Object.values(patch), id];

    await pool.query(`UPDATE employees SET ${sets} WHERE id = ?`, values);

    return this.getById(id);
  },

  // =========================
  // DELETE (NEW LOGIC: delete account(s) first, then employee) ✅
  // =========================
  async remove(id) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1) ensure employee exists
      const [eRows] = await conn.query("SELECT id FROM employees WHERE id = ? LIMIT 1", [id]);
      if (!eRows.length) {
        await conn.rollback();
        return false;
      }

      // 2) delete all accounts linked to this employeeId (hard delete)
      await conn.query("DELETE FROM accounts WHERE employeeId = ?", [id]);

      // 3) delete employee
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
