// src/services/accounts.service.js
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const DEBUG = String(process.env.DEBUG_AUTH || "").trim() === "1";
function dlog(...args) {
  if (DEBUG) console.log("[AUTH][accounts.service]", ...args);
}

function isActive(status) {
  const s = String(status ?? "").toLowerCase();
  return s === "active" || s === "hoạt động";
}

async function tableHasColumn(tableName, columnName) {
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
  const [rows] = await pool.query("SELECT * FROM accounts WHERE username = ? LIMIT 1", [username]);
  const acc = rows?.[0];
  if (!acc) throw new ApiError(401, "INVALID_USERNAME");

  const active = isActive(acc.status);
  if (!active) throw new ApiError(403, "ACCOUNT_INACTIVE");

  const ok = await bcrypt.compare(password, acc.password);
  if (!ok) throw new ApiError(401, "INVALID_PASSWORD");

  const permissions = await loadPermissionsByRole(acc.role);

  const secret = process.env.JWT_SECRET || "dev_secret";
  const token = jwt.sign(
    { id: acc.id, employeeId: acc.employeeId, role: acc.role, permissions },
    secret,
    { expiresIn: "1d" }
  );

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

// ✅ helper: getById có password để check đổi mật khẩu
async function getByIdWithPassword(id) {
  const hasDeletedAt = await tableHasColumn("accounts", "deleted_at");
  const whereSql = hasDeletedAt ? "AND a.deleted_at IS NULL" : "";

  const [rows] = await pool.query(
    `
    SELECT 
      a.id, a.username, a.password, a.employeeId, a.role, a.status, a.lastLoginAt, a.created_at, a.updated_at,
      e.employeeCode, e.name
    FROM accounts a
    LEFT JOIN employees e ON e.id = a.employeeId
    WHERE a.id = ?
    ${whereSql}
    LIMIT 1
    `,
    [id]
  );
  return rows?.[0] || null;
}

module.exports = {
  async login(username, password) {
    return doLogin(username, password);
  },

  async verifyLogin({ username, password }) {
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
  // LIST (NO PAGINATION) ✅
  // =========================
  async list(query = {}, currentUser) {
    const hasDeletedAt = await tableHasColumn("accounts", "deleted_at");

    const q = String(query.q || "").trim();
    const role = String(query.role || "").trim();
    const status = String(query.status || "").trim();

    const where = [];
    const params = [];

    if (hasDeletedAt) where.push("a.deleted_at IS NULL");

    if (q) {
      where.push("(a.username LIKE ? OR e.employeeCode LIKE ? OR e.name LIKE ?)");
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
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

    const [rows] = await pool.query(
      `
      SELECT 
        a.id, a.username, a.employeeId, a.role, a.status, a.lastLoginAt, a.created_at, a.updated_at,
        e.employeeCode, e.name
      FROM accounts a
      LEFT JOIN employees e ON e.id = a.employeeId
      ${whereSql}
      ORDER BY a.id DESC
      `,
      params
    );

    return rows; // ✅ mảng
  },

  // =========================
  // GET BY ID
  // =========================
  async getById(id) {
    const hasDeletedAt = await tableHasColumn("accounts", "deleted_at");
    const whereSql = hasDeletedAt ? "AND a.deleted_at IS NULL" : "";

    const [rows] = await pool.query(
      `
      SELECT 
        a.id, a.username, a.employeeId, a.role, a.status, a.lastLoginAt, a.created_at, a.updated_at,
        e.employeeCode, e.name
      FROM accounts a
      LEFT JOIN employees e ON e.id = a.employeeId
      WHERE a.id = ?
      ${whereSql}
      LIMIT 1
      `,
      [id]
    );
    return rows?.[0] || null;
  },

  // =========================
  // CREATE (giữ nguyên nếu bạn có)
  // =========================
  async create(payload, currentUser) {
    // Nếu bạn đã có create ở chỗ khác thì giữ nguyên.
    // (Mình không tự đoán create vì bạn chưa paste phần create đầy đủ)
    throw new ApiError(501, "create() not implemented in this snippet");
  },

  // =========================
  // UPDATE (role/status + đổi mật khẩu current/new) ✅
  // =========================
  async update(id, payload, currentUser) {
    const { username, employeeId, role, status, currentPassword, newPassword } = payload || {};

    const acc = await getByIdWithPassword(id);
    if (!acc) throw new ApiError(404, "Account not found");

    if (username && username !== acc.username) {
      const [exist] = await pool.query(
        "SELECT id FROM accounts WHERE username = ? AND id <> ? LIMIT 1",
        [username, id]
      );
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

    // ✅ đổi mật khẩu: chỉ khi client gửi newPassword
    if (newPassword !== undefined && String(newPassword).trim() !== "") {
      if (!currentPassword) throw new ApiError(400, "CURRENT_PASSWORD_REQUIRED");

      const ok = await bcrypt.compare(String(currentPassword), String(acc.password));
      if (!ok) throw new ApiError(401, "INVALID_CURRENT_PASSWORD");

      const hashed = await bcrypt.hash(String(newPassword), 12);
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
  // DELETE (giữ logic của bạn)
  // =========================
  async remove(id, currentUser) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [rows] = await conn.query("SELECT id, employeeId FROM accounts WHERE id = ? LIMIT 1", [
        id,
      ]);
      const acc = rows?.[0];
      if (!acc) throw new ApiError(404, "Account not found");

      const employeeId = acc.employeeId;

      await conn.query("DELETE FROM accounts WHERE id = ?", [id]);

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
