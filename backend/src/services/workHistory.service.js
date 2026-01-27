const pool = require("../config/db");

/**
 * Lấy tất cả lịch sử công tác (chưa bị xoá)
 */
module.exports.getAllWorkHistories = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM workhistory 
     WHERE deleted_at IS NULL
     ORDER BY effectiveDate DESC`
  );
  return rows;
};

/**
 * Lấy lịch sử công tác theo employeeId
 */
module.exports.getWorkHistoryByEmployeeId = async (employeeId) => {
  const [rows] = await pool.query(
    `SELECT * FROM workhistory 
     WHERE employeeId = ? AND deleted_at IS NULL
     ORDER BY effectiveDate DESC`,
    [employeeId]
  );
  return rows;
};

/**
 * Lấy 1 bản ghi theo id
 */
module.exports.getWorkHistoryById = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM workhistory 
     WHERE id = ? AND deleted_at IS NULL
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

/**
 * Thêm mới lịch sử công tác
 */
module.exports.addWorkHistory = async (data) => {
  const {
    employeeId,
    departmentId,
    positionId,
    eventType,
    effectiveDate,
    endDate,
    decisionNumber,
    content,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO workhistory
      (employeeId, departmentId, positionId, eventType, effectiveDate, endDate, decisionNumber, content, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      employeeId,
      departmentId,
      positionId,
      eventType,
      effectiveDate,
      endDate ?? null,
      decisionNumber ?? null,
      content ?? null,
    ]
  );

  return result.insertId;
};

/**
 * Cập nhật lịch sử công tác
 */
module.exports.updateWorkHistory = async (id, data) => {
  const {
    employeeId,
    departmentId,
    positionId,
    eventType,
    effectiveDate,
    endDate,
    decisionNumber,
    content,
  } = data;

  const [result] = await pool.query(
    `UPDATE workhistory
     SET employeeId = ?, departmentId = ?, positionId = ?, eventType = ?,
         effectiveDate = ?, endDate = ?, decisionNumber = ?, content = ?,
         updated_at = NOW()
     WHERE id = ? AND deleted_at IS NULL`,
    [
      employeeId,
      departmentId,
      positionId,
      eventType,
      effectiveDate,
      endDate ?? null,
      decisionNumber ?? null,
      content ?? null,
      id,
    ]
  );

  return result.affectedRows;
};

/**
 * Xoá mềm
 */
module.exports.deleteWorkHistory = async (id) => {
  const [result] = await pool.query(
    `UPDATE workhistory
     SET deleted_at = NOW(), updated_at = NOW()
     WHERE id = ? AND deleted_at IS NULL`,
    [id]
  );

  return result.affectedRows;
};
