const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

// ===== POSITION MAPPING =====
const POSITION_MAP = {
  ADMIN: 1,
  DIRECTOR: 2,
  HR: 3,
  ACCOUNTANT: 4,
  EMPLOYEE: 5,
};

function normalizePositionKey(s) {
  return String(s || "").trim().toUpperCase();
}

function mapPositionToId(positionText) {
  const key = normalizePositionKey(positionText);
  return POSITION_MAP[key] ?? null;
}

// ===== BASE SELECT (fix date timezone) =====
function selectBase() {
  return `
    SELECT
      wa.*,

      DATE_FORMAT(wa.assignedDate, '%Y-%m-%d') AS assignedDate,
      DATE_FORMAT(wa.deadline, '%Y-%m-%d')     AS deadline,

      DATE_FORMAT(wa.assignedDate, '%d/%m/%Y') AS assignedDateText,
      DATE_FORMAT(wa.deadline, '%d/%m/%Y')     AS deadlineText,

      e.name AS employeeName,
      e.employeeCode AS employeeCode,
      d.departmentName AS departmentName,
      t.taskName AS taskNameFromTask
    FROM workassignments wa
    LEFT JOIN employees e ON e.id = wa.employeeId
    LEFT JOIN departments d ON d.id = wa.departmentId
    LEFT JOIN tasks t ON t.id = wa.taskId
  `;
}

async function getById(id) {
  const [rows] = await pool.query(
    `
    ${selectBase()}
    WHERE wa.id = ? AND wa.deleted_at IS NULL
    LIMIT 1
    `,
    [id]
  );
  return rows[0] || null;
}

async function getAll(query = {}) {
  const where = ["wa.deleted_at IS NULL"];
  const params = [];

  if (query.departmentId) {
    where.push("wa.departmentId = ?");
    params.push(Number(query.departmentId));
  }

  if (query.employeeId) {
    where.push("wa.employeeId = ?");
    params.push(Number(query.employeeId));
  }

  if (query.status) {
    where.push("wa.status = ?");
    params.push(String(query.status));
  }

  const whereSql = `WHERE ${where.join(" AND ")}`;

  const [rows] = await pool.query(
    `
    ${selectBase()}
    ${whereSql}
    ORDER BY wa.createdAt DESC
    `,
    params
  );

  return rows;
}

async function create(data) {
  const {
    employeeId,
    departmentId,
    positionId,
    taskId,
    taskName,
    assignedDate,
    deadline,
    status,
    notes,
    assignedByAccountId,
  } = data;

  if (!employeeId) throw new ApiError(400, "employeeId is required");
  if (!assignedDate) throw new ApiError(400, "assignedDate is required");
  if (!taskId && !taskName)
    throw new ApiError(400, "taskId or taskName is required");

  let finalPositionId = positionId ?? null;

  if (!finalPositionId) {
    const [eRows] = await pool.query(
      "SELECT position FROM employees WHERE id = ? LIMIT 1",
      [employeeId]
    );
    if (!eRows.length) throw new ApiError(400, "employeeId invalid");
    finalPositionId = mapPositionToId(eRows[0].position);
  }

  let finalTaskName = taskName;
  if (taskId && !finalTaskName) {
    const [tRows] = await pool.query(
      "SELECT taskName FROM tasks WHERE id = ? LIMIT 1",
      [taskId]
    );
    if (!tRows.length) throw new ApiError(400, "taskId invalid");
    finalTaskName = tRows[0].taskName;
  }

  const [rs] = await pool.query(
    `
    INSERT INTO workassignments
    (employeeId, departmentId, positionId, taskId, taskName,
     assignedDate, deadline, status, notes,
     assignedByAccountId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `,
    [
      employeeId,
      departmentId ?? null,
      finalPositionId,
      taskId ?? null,
      finalTaskName,
      assignedDate,
      deadline ?? null,
      status ?? "PENDING",
      notes ?? null,
      assignedByAccountId ?? null,
    ]
  );

  return getById(rs.insertId);
}

async function update(id, data) {
  const current = await getById(id);
  if (!current) return null;

  await pool.query(
    `
    UPDATE workassignments
    SET employeeId = ?,
        departmentId = ?,
        positionId = ?,
        taskId = ?,
        taskName = ?,
        assignedDate = ?,
        deadline = ?,
        status = ?,
        notes = ?,
        assignedByAccountId = ?,
        updatedAt = NOW()
    WHERE id = ? AND deleted_at IS NULL
    `,
    [
      data.employeeId ?? current.employeeId,
      data.departmentId ?? current.departmentId,
      data.positionId ?? current.positionId,
      data.taskId ?? current.taskId,
      data.taskName ?? current.taskName,
      data.assignedDate ?? current.assignedDate,
      data.deadline ?? current.deadline,
      data.status ?? current.status,
      data.notes ?? current.notes,
      data.assignedByAccountId ?? current.assignedByAccountId,
      id,
    ]
  );

  return getById(id);
}

async function remove(id) {
  const [rs] = await pool.query(
    `
    UPDATE workassignments
    SET deleted_at = NOW(), updatedAt = NOW()
    WHERE id = ? AND deleted_at IS NULL
    `,
    [id]
  );
  return rs.affectedRows > 0;
}

async function getMine(employeeId) {
  if (!employeeId) throw new ApiError(400, "employeeId required");

  const [rows] = await pool.query(
    `
    SELECT
      wa.*,

      DATE_FORMAT(wa.assignedDate, '%Y-%m-%d') AS assignedDate,
      DATE_FORMAT(wa.deadline, '%Y-%m-%d')     AS deadline,
      DATE_FORMAT(wa.assignedDate, '%d/%m/%Y') AS assignedDateText,
      DATE_FORMAT(wa.deadline, '%d/%m/%Y')     AS deadlineText,

      e.name AS employeeName,
      e.employeeCode AS employeeCode,
      d.departmentName AS departmentName,
      t.taskName AS taskNameFromTask

    FROM workassignments wa
    LEFT JOIN employees e ON e.id = wa.employeeId
    LEFT JOIN departments d ON d.id = wa.departmentId
    LEFT JOIN tasks t ON t.id = wa.taskId

    WHERE wa.deleted_at IS NULL
      AND wa.employeeId = ?

    ORDER BY wa.createdAt DESC
    `,
    [Number(employeeId)]
  );

  return rows;
}

// ===== FIX CHO NÚT HOÀN THÀNH =====
async function updateMyStatus({ id, employeeId, status }) {
  if (!id) throw new ApiError(400, "id required");
  if (!employeeId) throw new ApiError(400, "employeeId required");
  if (!status) throw new ApiError(400, "status required");

  const allowed = new Set(["IN_PROGRESS", "DONE"]);
  if (!allowed.has(status))
    throw new ApiError(400, "Invalid status");

  const [rs] = await pool.query(
    `
    UPDATE workassignments
    SET status = ?, updatedAt = NOW()
    WHERE id = ? AND employeeId = ? AND deleted_at IS NULL
    `,
    [status, Number(id), Number(employeeId)]
  );

  if (rs.affectedRows === 0) return null;
  return getById(id);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getMine,
  updateMyStatus,
};