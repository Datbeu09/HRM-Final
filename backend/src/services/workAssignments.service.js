const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

async function getById(id) {
  const [rows] = await pool.query(
    `
    SELECT
      wa.*,
      e.name AS employeeName,
      e.employeeCode AS employeeCode,
      d.departmentName AS departmentName,
      t.taskName AS taskNameFromTask
    FROM workassignments wa
    LEFT JOIN employees e ON e.id = wa.employeeId
    LEFT JOIN departments d ON d.id = wa.departmentId
    LEFT JOIN tasks t ON t.id = wa.taskId
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

  // optional: lọc theo taskId
  if (query.taskId) {
    where.push("wa.taskId = ?");
    params.push(Number(query.taskId));
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [rows] = await pool.query(
    `
    SELECT
      wa.*,
      e.name AS employeeName,
      e.employeeCode AS employeeCode,
      d.departmentName AS departmentName,
      t.taskName AS taskNameFromTask
    FROM workassignments wa
    LEFT JOIN employees e ON e.id = wa.employeeId
    LEFT JOIN departments d ON d.id = wa.departmentId
    LEFT JOIN tasks t ON t.id = wa.taskId
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

  // ===== validate theo popup =====
  if (!employeeId) throw new ApiError(400, "employeeId is required");
  if (!assignedDate) throw new ApiError(400, "assignedDate is required");
  if (!taskId && !taskName) throw new ApiError(400, "taskId or taskName is required");

  // nếu có taskId mà chưa có taskName -> lấy taskName từ tasks
  let finalTaskName = taskName;
  if (taskId && !finalTaskName) {
    const [tRows] = await pool.query("SELECT taskName FROM tasks WHERE id = ? LIMIT 1", [taskId]);
    if (!tRows.length) throw new ApiError(400, "taskId is invalid");
    finalTaskName = tRows[0].taskName;
  }

  const finalStatus = status ?? "PENDING";

  const [rs] = await pool.query(
    `
    INSERT INTO workassignments
      (employeeId, departmentId, positionId, taskId, taskName,
       assignedDate, deadline, status, notes,
       assignedByAccountId, createdAt, updatedAt)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `,
    [
      employeeId,
      departmentId ?? null,
      positionId ?? null,
      taskId ?? null,
      finalTaskName,
      assignedDate,
      deadline ?? null,
      finalStatus,
      notes ?? null,
      assignedByAccountId ?? null,
    ]
  );

  return getById(rs.insertId);
}

async function update(id, data) {
  const current = await getById(id);
  if (!current) return null;

  // nếu update taskId mà taskName trống -> fill từ tasks
  let nextTaskName = data.taskName ?? current.taskName;

  const nextTaskId =
    data.taskId !== undefined ? (data.taskId ?? null) : (current.taskId ?? null);

  if (data.taskId !== undefined && nextTaskId && !data.taskName) {
    const [tRows] = await pool.query("SELECT taskName FROM tasks WHERE id = ? LIMIT 1", [nextTaskId]);
    if (!tRows.length) throw new ApiError(400, "taskId is invalid");
    nextTaskName = tRows[0].taskName;
  }

  // vẫn đảm bảo (taskId OR taskName) sau update
  if (!nextTaskId && !nextTaskName) {
    throw new ApiError(400, "taskId or taskName is required");
  }

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
      nextTaskId,
      nextTaskName,
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
  if (!employeeId) throw new ApiError(400, "employeeId is required");

  const [rows] = await pool.query(
    `
    SELECT
      wa.*,
      e.name AS employeeName,
      e.employeeCode AS employeeCode,
      d.departmentName AS departmentName,
      t.taskName AS taskNameFromTask,

      -- response của chính employee này (nếu có)
      war.status AS responseStatus,
      war.respondedAt AS responseRespondedAt,
      war.rejectReason AS responseRejectReason
    FROM workassignments wa
    LEFT JOIN employees e ON e.id = wa.employeeId
    LEFT JOIN departments d ON d.id = wa.departmentId
    LEFT JOIN tasks t ON t.id = wa.taskId
    LEFT JOIN workassignmentresponses war
      ON war.workAssignmentId = wa.id AND war.employeeId = ?
    WHERE wa.deleted_at IS NULL
      AND wa.employeeId = ?
    ORDER BY wa.createdAt DESC
    `,
    [Number(employeeId), Number(employeeId)]
  );

  return rows;
  async function updateMyStatus({ id, employeeId, status }) {
  // check assignment thuộc về employee đang login
  const [rows] = await pool.query(
    `SELECT id, employeeId FROM workassignments WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
    [id]
  );

  if (!rows.length) return null;

  if (Number(rows[0].employeeId) !== Number(employeeId)) {
    throw new ApiError(403, "You are not allowed to update this assignment");
  }

  await pool.query(
    `UPDATE workassignments SET status = ?, updatedAt = NOW() WHERE id = ? AND deleted_at IS NULL`,
    [status, id]
  );

  // trả lại row đầy đủ (reuse getById)
  return getById(id);
}
}
module.exports = { getAll, getById, create, update, remove, getMine };
