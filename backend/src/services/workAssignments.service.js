const pool = require("../config/db");

// ===== GET ALL (chưa bị xoá mềm) =====
async function getAll(query = {}) {
  let where = "WHERE wa.deleted_at IS NULL";
  const params = [];

  if (query.employeeId) {
    where += " AND wa.employeeId = ?";
    params.push(query.employeeId);
  }

  if (query.status) {
    where += " AND wa.status = ?";
    params.push(query.status);
  }

  const [rows] = await pool.query(
    `
    SELECT wa.*
    FROM workassignments wa
    ${where}
    ORDER BY wa.createdAt DESC
    `,
    params
  );

  return rows;
}

// ===== GET BY ID =====
async function getById(id) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM workassignments
    WHERE id = ? AND deleted_at IS NULL
    LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

// ===== CREATE =====
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
      departmentId,
      positionId,
      taskId,
      taskName,
      assignedDate,
      deadline,
      status,
      notes ?? null,
      assignedByAccountId,
    ]
  );

  return getById(rs.insertId);
}

// ===== UPDATE =====
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

// ===== SOFT DELETE =====
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

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
