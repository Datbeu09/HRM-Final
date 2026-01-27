// src/services/accounts.service.js
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

// bật debug bằng cách set: DEBUG_AUTH=1
const DEBUG = String(process.env.DEBUG_AUTH || "").trim() === "1";
function dlog(...args) {
  if (DEBUG) console.log("[AUTH][accounts.service]", ...args);
}

function isActive(status) {
  const s = String(status ?? "").toLowerCase();
  return s === "active" || s === "hoạt động";
}

function safeUser(acc, permissions = []) {
  if (!acc) return null;
  return {
    id: acc.id,
    username: acc.username,
    employeeId: acc.employeeId,
    role: acc.role,
    status: acc.status,
    permissions,
  };
}

async function tableHasColumn(tableName, columnName) {
  // check schema at runtime to avoid crashes if deleted_at doesn't exist
  const [rows] = await pool.query(
    `
    SELECT COUNT(*) as cnt
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
      AND COLUMN_NAME = ?
    `,
    [tableName, columnName]
  );
  return Number(rows?.[0]?.cnt || 0) > 0;
}

async function loadPermissionsByRole(role) {
  const [perms] = await pool.query(
    `
    SELECT p.code
    FROM rolepermissions rp
    JOIN permissions p ON p.id = rp.permissionId
    WHERE rp.role = ?
      AND rp.allow = 1
    `,
    [role]
  );
  return (perms || []).map((p) => p.code);
}

async function doLogin(username, password) {
  const startedAt = Date.now();
  dlog("Node:", process.version);
  dlog("login() called with username =", username, "password_len =", String(password ?? "").length);

  // 1) Query account
  const [rows] = await pool.query("SELECT * FROM accounts WHERE username = ? LIMIT 1", [username]);
  const acc = rows?.[0];
  dlog("acc found?", !!acc, acc ? safeUser(acc) : null);

  if (!acc) throw new ApiError(401, "Invalid credentials");

  // 2) Status check
  const active = isActive(acc.status);
  dlog("status =", acc.status, "=> isActive =", active);
  if (!active) throw new ApiError(403, "Account is inactive");

  // 3) Compare password
  const ok = await bcrypt.compare(password, acc.password);
  dlog("bcrypt.compare result =", ok);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  // 4) Load permissions
  const permissions = await loadPermissionsByRole(acc.role);

  // 5) Create token
  const secret = process.env.JWT_SECRET || "dev_secret";
  const token = jwt.sign(
    {
      id: acc.id,
      employeeId: acc.employeeId,
      role: acc.role,
      permissions,
    },
    secret,
    { expiresIn: "1d" }
  );

  // 6) Update lastLoginAt
  await pool.query("UPDATE accounts SET lastLoginAt = NOW(), updated_at = NOW() WHERE id = ?", [
    acc.id,
  ]);

  return {
    token,
    user: {
      id: acc.id,
      username: acc.username,
      employeeId: acc.employeeId,
      role: acc.role,
      permissions,
    },
  };
}

module.exports = {
  // =========================
  // LOGIN
  // =========================
  async login(username, password) {
    return doLogin(username, password);
  },

  // =========================
  // verifyLogin (tương thích controller cũ)
  // =========================
  async verifyLogin({ username, password }) {
    dlog("verifyLogin() called => delegating to login()");
    const result = await doLogin(username, password);
    return {
      id: result.user.id,
      username: result.user.username,
      employeeId: result.user.employeeId,
      role: result.user.role,
      permissions: result.user.permissions,
      token: result.token,
    };
  },

  // =========================
  // LIST
  // =========================
  async list(query = {}, currentUser) {
    const hasDeletedAt = await tableHasColumn("accounts", "deleted_at");

    const page = Math.max(1, parseInt(query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || "20", 10)));
    const offset = (page - 1) * limit;

    const q = String(query.q || "").trim();
    const role = String(query.role || "").trim();
    const status = String(query.status || "").trim();

    const where = [];
    const params = [];

    if (hasDeletedAt) where.push("a.deleted_at IS NULL");

    if (q) {
      where.push("(a.username LIKE ? OR CAST(a.employeeId AS CHAR) LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (role) {
      where.push("a.role = ?");
      params.push(role);
    }
    if (status) {
      where.push("a.status = ?");
      params.push(status);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [[countRow]] = await pool.query(`SELECT COUNT(*) AS total FROM accounts a ${whereSql}`, params);

    const [rows] = await pool.query(
      `
      SELECT a.id, a.username, a.employeeId, a.role, a.status, a.lastLoginAt, a.created_at, a.updated_at
      FROM accounts a
      ${whereSql}
      ORDER BY a.id DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    return {
      data: rows,
      paging: {
        page,
        limit,
        total: Number(countRow?.total || 0),
        totalPages: Math.ceil(Number(countRow?.total || 0) / limit) || 1,
      },
    };
  },

  // =========================
  // GET BY ID
  // =========================
  async getById(id) {
    const hasDeletedAt = await tableHasColumn("accounts", "deleted_at");

    const whereSql = hasDeletedAt ? "AND deleted_at IS NULL" : "";
    const [rows] = await pool.query(
      `
      SELECT id, username, employeeId, role, status, lastLoginAt, created_at, updated_at
      FROM accounts
      WHERE id = ?
      ${whereSql}
      LIMIT 1
      `,
      [id]
    );
    return rows?.[0] || null;
  },

  // =========================
  // CREATE
  // =========================
  async create(payload, currentUser) {
    const { username, password, employeeId = null, role = "USER", status = "ACTIVE" } = payload || {};

    if (!username || !password) throw new ApiError(400, "username and password are required");

    const [exist] = await pool.query("SELECT id FROM accounts WHERE username = ? LIMIT 1", [username]);
    if (exist?.length) throw new ApiError(409, "Username already exists");

    const hashed = await bcrypt.hash(password, 12);

    const [rs] = await pool.query(
      `
      INSERT INTO accounts (username, password, employeeId, role, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [username, hashed, employeeId, role, status]
    );

    const created = await this.getById(rs.insertId);
    return created;
  },

  // =========================
  // UPDATE
  // =========================
  async update(id, payload, currentUser) {
    const { username, password, employeeId, role, status } = payload || {};

    const acc = await this.getById(id);
    if (!acc) throw new ApiError(404, "Account not found");

    if (username && username !== acc.username) {
      const [exist] = await pool.query("SELECT id FROM accounts WHERE username = ? AND id <> ? LIMIT 1", [
        username,
        id,
      ]);
      if (exist?.length) throw new ApiError(409, "Username already exists");
    }

    const fields = [];
    const params = [];

    if (username !== undefined) {
      fields.push("username = ?");
      params.push(username);
    }
    if (employeeId !== undefined) {
      fields.push("employeeId = ?");
      params.push(employeeId);
    }
    if (role !== undefined) {
      fields.push("role = ?");
      params.push(role);
    }
    if (status !== undefined) {
      fields.push("status = ?");
      params.push(status);
    }
    if (password) {
      const hashed = await bcrypt.hash(password, 12);
      fields.push("password = ?");
      params.push(hashed);
    }

    if (!fields.length) return await this.getById(id);

    params.push(id);

    await pool.query(
      `
      UPDATE accounts
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = ?
      `,
      params
    );

    return await this.getById(id);
  },

  // =========================
  // DELETE (NEW LOGIC: delete account + its employee) ✅
  // =========================
  async remove(id, currentUser) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // get account (even if deleted_at exists, we still want employeeId)
      const [rows] = await conn.query("SELECT id, employeeId FROM accounts WHERE id = ? LIMIT 1", [id]);
      const acc = rows?.[0];
      if (!acc) throw new ApiError(404, "Account not found");

      const employeeId = acc.employeeId;

      // delete THIS account
      await conn.query("DELETE FROM accounts WHERE id = ?", [id]);

      // delete employee (and any other accounts linked to that employeeId - safety)
      if (employeeId) {
        await conn.query("DELETE FROM accounts WHERE employeeId = ?", [employeeId]);
        await conn.query("DELETE FROM employees WHERE id = ?", [employeeId]);
      }

      await conn.commit();
      return;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  },
};
